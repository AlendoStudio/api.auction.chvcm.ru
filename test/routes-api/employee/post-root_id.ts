import {reCaptchaMockAdapter} from "../../common";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as sinon from "sinon";
import * as supertest from "supertest";

import {BooleanUnitCodes, ObjectUnitCodes, PgBigSerialUnitCodes} from "@alendo/express-req-validator";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  Env,
  IEmployeeInstance,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /employee/:id", () => {
  let token: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
      admin: true,
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super duper password"),
      phone: "+79123456789",
      tfa: false,
    });
    token = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(200, {
        id: "2",
      });
  });

  it("wrong id", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/0`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: PgBigSerialUnitCodes.WRONG_PG_BIGSERIAL,
        message: "params.id: bigserial must be more or equal than 1",
      });
  });

  it("null admin", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .send({
        admin: null,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.admin: value can't be null",
      });
  });

  it("null banned", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .send({
        banned: null,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.banned: value can't be null",
      });
  });

  it("null moderator", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .send({
        moderator: null,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.moderator: value can't be null",
      });
  });

  it("wrong admin", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .send({
        admin: "true",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.admin: value must be boolean",
      });
  });

  it("wrong banned", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .send({
        banned: "true",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.banned: value must be boolean",
      });
  });

  it("wrong moderator", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .send({
        moderator: "true",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.moderator: value must be boolean",
      });
  });

  it("required admin", async () => {
    await Sequelize.instance.employee.update({
      admin: false,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_ADMIN,
        message: "required admin",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("grant admin (for employee)", async () => {
    await Sequelize.instance.employee.update({
      admin: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(true);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("grant admin (for admin)", async () => {
    await Sequelize.instance.employee.update({
      admin: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(true);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("grant moderator (for employee)", async () => {
    await Sequelize.instance.employee.update({
      moderator: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(true);

    sinon.assert.notCalled(spyMail);
  });

  it("grant moderator (for moderator)", async () => {
    await Sequelize.instance.employee.update({
      moderator: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(true);

    sinon.assert.notCalled(spyMail);
  });

  it("grant admin and moderator (for employee)", async () => {
    await Sequelize.instance.employee.update({
      admin: false,
      moderator: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: true,
        moderator: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(true);
    expect((employee as IEmployeeInstance).moderator).equal(true);

    sinon.assert.notCalled(spyMail);
  });

  it("grant admin and moderator (for admin + moderator)", async () => {
    await Sequelize.instance.employee.update({
      admin: true,
      moderator: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: true,
        moderator: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(true);
    expect((employee as IEmployeeInstance).moderator).equal(true);

    sinon.assert.notCalled(spyMail);
  });

  it("prohibit admin (for employee)", async () => {
    await Sequelize.instance.employee.update({
      admin: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("prohibit admin (for admin)", async () => {
    await Sequelize.instance.employee.update({
      admin: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("prohibit moderator (for employee)", async () => {
    await Sequelize.instance.employee.update({
      moderator: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("prohibit moderator (for moderator)", async () => {
    await Sequelize.instance.employee.update({
      moderator: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("prohibit admin and moderator (for admin + moderator)", async () => {
    await Sequelize.instance.employee.update({
      admin: true,
      moderator: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: false,
        moderator: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("ban banned", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(true);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("unban unbanned", async () => {
    await Sequelize.instance.employee.update({
      banned: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("ban unbanned - ru email", async () => {
    await Sequelize.instance.employee.update({
      banned: false,
      language: "ru",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(true);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Ваша учетная запись была забанена!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });

  it("ban unbanned - en email", async () => {
    await Sequelize.instance.employee.update({
      banned: false,
      language: "en",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(true);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was banned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });

  it("ban unbanned - other email", async () => {
    await Sequelize.instance.employee.update({
      banned: false,
      language: "de",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(true);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was banned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });

  it("unban banned - ru email", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
      language: "ru",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Ваша учетная запись была разбанена!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });

  it("unban banned - en email", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
      language: "en",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was unbanned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });

  it("unban banned - other email", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
      language: "de",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);
    const employee = await Sequelize.instance.employee.findById("2");
    expect((employee as IEmployeeInstance).banned).equal(false);
    expect((employee as IEmployeeInstance).admin).equal(false);
    expect((employee as IEmployeeInstance).moderator).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was unbanned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });
});
