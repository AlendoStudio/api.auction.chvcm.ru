import {reCaptchaMockAdapter} from "../../common";

import {NotEmptyStringUnitCodes, ObjectUnitCodes} from "@alendo/express-req-validator";

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
  IAttachmentInstance, IEntityInstance,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /attachment", () => {
  let token: string;
  let tokenEmployee: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    token = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signup`)
      .send({
        ceo: "Catherine Havasi",
        email: "entity@example.com",
        itn: 76_27_01931_7,
        language: "en",
        name: "Luminoso",
        password: "super duper password",
        phone: "+16176829056",
        psrn: 1_02_76_01_59327_1,
      })
      .expect(200)).body.token;
    await Sequelize.instance.employee.insertOrUpdate({
      email: "admin@example.com",
      language: "ru",
      moderator: true,
      name: "admin",
      password: await Bcrypt.hash("super duper password"),
      phone: "+79123456789",
      tfa: false,
    });
    tokenEmployee = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
  });

  it("required entity", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_ENTITY,
        message: "required entity",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("missing url", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.url: missing value",
      });
  });

  it("null url", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.url: value can't be null",
      });
  });

  it("wrong url", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "",
      })
      .expect(400, {
        code: NotEmptyStringUnitCodes.WRONG_NOT_EMPTY_STRING,
        message: "body.url: value must be not empty string",
      });
  });

  it("correct - without email", async () => {
    await Sequelize.instance.entity.update({
      verified: false,
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://example.com/attachment.zip",
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("1") as IEntityInstance;
    expect(entity.verified).equal(false);

    const attachment = await Sequelize.instance.attachment.findById("1") as IAttachmentInstance;
    expect(attachment.userid).equal("1");
    expect(attachment.url).equal("https://example.com/attachment.zip");

    sinon.assert.notCalled(spyMail);
  });

  it("correct - ru email", async () => {
    await Sequelize.instance.entity.update({
      language: "ru",
      verified: true,
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://example.com/attachment.zip",
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("1") as IEntityInstance;
    expect(entity.verified).equal(false);

    const attachment = await Sequelize.instance.attachment.findById("1") as IAttachmentInstance;
    expect(attachment.userid).equal("1");
    expect(attachment.url).equal("https://example.com/attachment.zip");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Ваша учетная запись ожидает проверки!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("correct - en email", async () => {
    await Sequelize.instance.entity.update({
      language: "en",
      verified: true,
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://example.com/attachment.zip",
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("1") as IEntityInstance;
    expect(entity.verified).equal(false);

    const attachment = await Sequelize.instance.attachment.findById("1") as IAttachmentInstance;
    expect(attachment.userid).equal("1");
    expect(attachment.url).equal("https://example.com/attachment.zip");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account is not verified!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });

  it("correct - other email", async () => {
    await Sequelize.instance.entity.update({
      language: "de",
      verified: true,
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://example.com/attachment.zip",
      })
      .expect(204);

    const entity = await Sequelize.instance.entity.findById("1") as IEntityInstance;
    expect(entity.verified).equal(false);

    const attachment = await Sequelize.instance.attachment.findById("1") as IAttachmentInstance;
    expect(attachment.userid).equal("1");
    expect(attachment.url).equal("https://example.com/attachment.zip");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Your account is not verified!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("entity@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("Luminoso");
    expect(spyMail.args[0][0].originalMessage.text).contains("Luminoso");
  });
});
