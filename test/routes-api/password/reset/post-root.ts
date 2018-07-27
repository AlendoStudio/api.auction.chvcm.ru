import {reCaptchaMockAdapter} from "../../../common";

import {ObjectUnitCodes, ZxcvbnUnitCodes} from "@alendo/express-req-validator";

import {expect} from "chai";
import * as cuid from "cuid";
import {beforeEach, describe, it} from "mocha";
import * as sinon from "sinon";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  Env,
  ITokensPasswordResetInstance,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../../src";

describe("POST /password/reset", () => {
  let passwordResetToken: string;
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset/email`)
      .send({
        email: "admin@example.com",
      })
      .expect(200);
    passwordResetToken = (await Sequelize.instance.tokensPasswordReset.findOne({
      where: {
        userid: "1",
      },
    }) as ITokensPasswordResetInstance).token as string;
  });

  it("user not found by password reset token (token does not exists)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${cuid()}`)
      .send({
        password: "new super duper password",
      })
      .expect(401, {
        code: ApiCodes.DB_USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN,
        message: "user not found by password reset token",
      });
  });

  it("user not found by password reset token (expired token)", async () => {
    await Sequelize.instance.tokensPasswordReset.update({
      expires: new Date(),
    }, {
      where: {
        token: passwordResetToken,
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "new super duper password",
      })
      .expect(401, {
        code: ApiCodes.DB_USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN,
        message: "user not found by password reset token",
      });
  });

  it("user was banned", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "new super duper password",
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });

  it("wrong password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "",
      })
      .expect(400, {
        code: ZxcvbnUnitCodes.WRONG_ZXCVBN,
        message: `body.password: password minimum score must be >= ${Const.MINIMUM_PASSWORD_SCORE}`,
      });
  });

  it("null password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: `body.password: value can't be null`,
      });
  });

  it("missing password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({})
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.password: missing value",
      });
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "new super duper password",
      })
      .expect(204);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(401);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "new super duper password",
      })
      .expect(200);

    sinon.assert.calledTwice(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Пароль был сброшен!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");

    const tokensPasswordResetCount = await Sequelize.instance.tokensPasswordReset.count({
      where: {
        token: passwordResetToken,
      },
    });
    expect(tokensPasswordResetCount).equal(0);
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "new super duper password",
      })
      .expect(204);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(401);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "new super duper password",
      })
      .expect(200);

    sinon.assert.calledTwice(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Password was reset!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");

    const tokensPasswordResetCount = await Sequelize.instance.tokensPasswordReset.count({
      where: {
        token: passwordResetToken,
      },
    });
    expect(tokensPasswordResetCount).equal(0);
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "new super duper password",
      })
      .expect(204);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(401);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "new super duper password",
      })
      .expect(200);

    sinon.assert.calledTwice(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Password was reset!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");

    const tokensPasswordResetCount = await Sequelize.instance.tokensPasswordReset.count({
      where: {
        token: passwordResetToken,
      },
    });
    expect(tokensPasswordResetCount).equal(0);
  });
});
