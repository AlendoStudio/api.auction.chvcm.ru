import {reCaptchaMockAdapter} from "../../common";

import {BooleanUnitCodes, ObjectUnitCodes, PgBigSerialUnitCodes} from "@alendo/express-req-validator";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as sinon from "sinon";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  Env,
  IEntityInstance,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /entity/:id", () => {
  let token: string;
  beforeEach("", async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
      email: "admin@example.com",
      language: "ru",
      moderator: true,
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signup`)
      .send({
        ceo: "Catherine Havasi",
        email: "entity@example.com",
        itn: 76_27_01931_7,
        language: "ru",
        name: "Luminoso",
        password: "super duper password",
        phone: "+16176829056",
        psrn: 1_02_76_01_59327_1,
      })
      .expect(200);
  });

  it("required moderator", async () => {
    await Sequelize.instance.employee.update({
      moderator: false,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("wrong id", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/0`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: PgBigSerialUnitCodes.WRONG_PG_BIGSERIAL,
        message: "params.id: bigserial must be more or equal than 1",
      });
  });

  it("null banned", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.banned: value can't be null",
      });
  });

  it("null verified", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.verified: value can't be null",
      });
  });

  it("wrong banned", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: "true",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.banned: value must be boolean",
      });
  });

  it("wrong verified", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: "false",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.verified: value must be boolean",
      });
  });

  it("empty request", async () => {
    await Sequelize.instance.entity.update({
      banned: false,
      language: "ru",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("ban unbanned - ru email", async () => {
    await Sequelize.instance.entity.update({
      banned: false,
      language: "ru",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(true);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Ваша учетная запись была забанена!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("ban unbanned - en email", async () => {
    await Sequelize.instance.entity.update({
      banned: false,
      language: "en",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(true);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was banned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("ban unbanned - other email", async () => {
    await Sequelize.instance.entity.update({
      banned: false,
      language: "de",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(true);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was banned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("ban banned", async () => {
    await Sequelize.instance.entity.update({
      banned: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(true);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("unban banned - ru email", async () => {
    await Sequelize.instance.entity.update({
      banned: true,
      language: "ru",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Ваша учетная запись была разбанена!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("unban banned - en email", async () => {
    await Sequelize.instance.entity.update({
      banned: true,
      language: "en",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was unbanned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("unban banned - other email", async () => {
    await Sequelize.instance.entity.update({
      banned: true,
      language: "de",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was unbanned!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("unban unbanned", async () => {
    await Sequelize.instance.entity.update({
      banned: false,
      language: "de",
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.notCalled(spyMail);
  });

  it("verify unverified - ru email", async () => {
    await Sequelize.instance.entity.update({
      language: "ru",
      verified: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(true);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Ваша учетная запись была проверена!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("verify unverified - en email", async () => {
    await Sequelize.instance.entity.update({
      language: "en",
      verified: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(true);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was verified!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("verify unverified - other email", async () => {
    await Sequelize.instance.entity.update({
      language: "de",
      verified: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(true);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account was verified!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("verify verified", async () => {
    await Sequelize.instance.entity.update({
      verified: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: true,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(true);

    sinon.assert.notCalled(spyMail);
  });

  it("unverify verified - ru email", async () => {
    await Sequelize.instance.entity.update({
      language: "ru",
      verified: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Ваша учетная запись ожидает проверки!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("unverify verified - en email", async () => {
    await Sequelize.instance.entity.update({
      language: "en",
      verified: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account is not verified!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("unverify verified - other email", async () => {
    await Sequelize.instance.entity.update({
      language: "de",
      verified: true,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account is not verified!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("unverify unverified", async () => {
    await Sequelize.instance.entity.update({
      language: "de",
      verified: false,
    }, {
      where: {
        id: "2",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        verified: false,
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("2");
    expect((entity as IEntityInstance).banned).equal(false);
    expect((entity as IEntityInstance).verified).equal(false);

    sinon.assert.notCalled(spyMail);
  });
});
