import {reCaptchaMockAdapter} from "../../../common";

import {EmailUnitCodes, ObjectUnitCodes} from "@alendo/express-req-validator";

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
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../../src";

describe("POST /password/reset/email", () => {
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super duper password"),
      phone: "+79123456789",
      tfa: false,
    });
  });

  it("reCaptcha not valid", async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: false,
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example.com",
      })
      .expect(401, {
        code: ApiCodes.WRONG_RECAPTCHA,
        message: "FUCK YOU BOT!",
      });
  });

  it("wrong email", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example",
      })
      .expect(400, {
        code: EmailUnitCodes.WRONG_EMAIL,
        message: `body.email: email must be in format "user@example.com"`,
      });
  });

  it("null email", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: `body.email: value can't be null`,
      });
  });

  it("missing email", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({})
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.email: missing value",
      });
  });

  it("user not found", async () => {
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example.xxx",
      })
      .expect(401, {
        code: ApiCodes.DB_USER_NOT_FOUND_BY_EMAIL,
        message: "user with same email not found",
      });
    sinon.assert.notCalled(spyMail);
  });

  it("user was banned", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example.com",
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
    sinon.assert.notCalled(spyMail);
  });

  it("correct - ru email", async () => {
    await Sequelize.instance.employee.update({
      language: "ru",
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example.com",
      })
      .expect(200);
    expect(res.body).to.have.keys("expires");
    expect(new Date(res.body.expires)).be.a("Date");
    expect(Date.now() - new Date(res.body.expires).getTime() - Const.TOKENS_PASSWORD_RESET_EXPIRESIN)
      .lessThan(1000 * 2);

    const token = await Sequelize.instance.tokensPasswordReset.findAndCountAll({
      where: {
        userid: "1",
      },
    });
    expect(token.count).equal(1);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Сброс пароля!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.html).contains(token.rows[0].token as string);
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains(token.rows[0].token as string);
  });

  it("correct - en email", async () => {
    await Sequelize.instance.employee.update({
      language: "en",
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example.com",
      })
      .expect(200);
    expect(res.body).to.have.keys("expires");
    expect(new Date(res.body.expires)).be.a("Date");
    expect(Date.now() - new Date(res.body.expires).getTime() - Const.TOKENS_PASSWORD_RESET_EXPIRESIN)
      .lessThan(1000 * 2);

    const token = await Sequelize.instance.tokensPasswordReset.findAndCountAll({
      where: {
        userid: "1",
      },
    });
    expect(token.count).equal(1);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Password reset!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.html).contains(token.rows[0].token as string);
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains(token.rows[0].token as string);
  });

  it("correct - other email", async () => {
    await Sequelize.instance.employee.update({
      language: "de",
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example.com",
      })
      .expect(200);
    expect(res.body).to.have.keys("expires");
    expect(new Date(res.body.expires)).be.a("Date");
    expect(Date.now() - new Date(res.body.expires).getTime() - Const.TOKENS_PASSWORD_RESET_EXPIRESIN)
      .lessThan(1000 * 2);

    const token = await Sequelize.instance.tokensPasswordReset.findAndCountAll({
      where: {
        userid: "1",
      },
    });
    expect(token.count).equal(1);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Password reset!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.html).contains(token.rows[0].token as string);
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains(token.rows[0].token as string);
  });
});
