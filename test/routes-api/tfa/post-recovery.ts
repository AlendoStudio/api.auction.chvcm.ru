import {reCaptchaMockAdapter} from "../../common";

import {NotEmptyStringUnitCodes, ObjectUnitCodes} from "@alendo/express-req-validator";

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
  Jwt,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /tfa/recovery", () => {
  let purgatoryToken: string;
  let tokens: string[];
  let recoveryCode: string;
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
    const authToken = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
    tokens = await (await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)).body.tokens;
    recoveryCode = tokens[0];
    tokens = tokens.slice(1);
    await Sequelize.instance.user.update({
      tfa: true,
    }, {
      where: {
        id: "1",
      },
    });
    purgatoryToken = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
  });

  it("user was banned", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: recoveryCode,
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });

  it("user not found by purgatory token (token does not exists)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${cuid()}`)
      .send({
        token: recoveryCode,
      })
      .expect(401, {
        code: ApiCodes.DB_USER_NOT_FOUND_BY_PURGATORY_TOKEN,
        message: "user not found by purgatory token",
      });
  });

  it("user not found by purgatory token (expired token)", async () => {
    await Sequelize.instance.tokensTfaPurgatory.update({
      expires: new Date(),
    }, {
      where: {
        token: purgatoryToken,
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: recoveryCode,
      })
      .expect(401, {
        code: ApiCodes.DB_USER_NOT_FOUND_BY_PURGATORY_TOKEN,
        message: "user not found by purgatory token",
      });
  });

  it("wrong token", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: 1234567890,
      })
      .expect(400, {
        code: NotEmptyStringUnitCodes.WRONG_NOT_EMPTY_STRING,
        message: `body.token: value must be not empty string`,
      });
  });

  it("missing token", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({})
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.token: missing value",
      });
  });

  it("null token", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.token: value can't be null",
      });
  });

  it("token not found", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: cuid(),
      })
      .expect(401, {
        code: ApiCodes.DB_TOKENS_TFA_RECOVERY_NOT_FOUND,
        message: "recovery code for this user not found",
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
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: recoveryCode,
      })
      .expect(200);
    expect(res.body).to.have.keys("token", "tfa");
    expect(res.body.token).be.a("string");
    expect(res.body.tfa).be.a("boolean");
    expect(res.body.tfa).equal(true);
    const parsedToken = await Jwt.verifyUser(res.body.token);
    expect(parsedToken).to.have.keys("id", "type");
    expect(parsedToken.id).be.a("string");
    expect(parsedToken.type).be.a("string");
    expect(parsedToken.id).equal("1");
    expect(parsedToken.type).equal("employee");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Был выполнен вход в систему!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");

    const purgatoryTokenCount = await Sequelize.instance.tokensTfaPurgatory.count({
      where: {
        token: purgatoryToken,
      },
    });
    expect(purgatoryTokenCount).equal(0);

    const lefTokens = await Sequelize.instance.tokensTfaRecovery.findAll({
      where: {
        userid: "1",
      },
    });
    expect(lefTokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT - 1);
    expect(tokens).to.be.deep.equal(lefTokens.map((item) => item.token));
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
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: recoveryCode,
      })
      .expect(200);
    expect(res.body).to.have.keys("token", "tfa");
    expect(res.body.token).be.a("string");
    expect(res.body.tfa).be.a("boolean");
    expect(res.body.tfa).equal(true);
    const parsedToken = await Jwt.verifyUser(res.body.token);
    expect(parsedToken).to.have.keys("id", "type");
    expect(parsedToken.id).be.a("string");
    expect(parsedToken.type).be.a("string");
    expect(parsedToken.id).equal("1");
    expect(parsedToken.type).equal("employee");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("You're logged in!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");

    const purgatoryTokenCount = await Sequelize.instance.tokensTfaPurgatory.count({
      where: {
        token: purgatoryToken,
      },
    });
    expect(purgatoryTokenCount).equal(0);

    const lefTokens = await Sequelize.instance.tokensTfaRecovery.findAll({
      where: {
        userid: "1",
      },
    });
    expect(lefTokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT - 1);
    expect(tokens).to.be.deep.equal(lefTokens.map((item) => item.token));
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
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/tfa/recovery`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: recoveryCode,
      })
      .expect(200);
    expect(res.body).to.have.keys("token", "tfa");
    expect(res.body.token).be.a("string");
    expect(res.body.tfa).be.a("boolean");
    expect(res.body.tfa).equal(true);
    const parsedToken = await Jwt.verifyUser(res.body.token);
    expect(parsedToken).to.have.keys("id", "type");
    expect(parsedToken.id).be.a("string");
    expect(parsedToken.type).be.a("string");
    expect(parsedToken.id).equal("1");
    expect(parsedToken.type).equal("employee");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("You're logged in!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");

    const purgatoryTokenCount = await Sequelize.instance.tokensTfaPurgatory.count({
      where: {
        token: purgatoryToken,
      },
    });
    expect(purgatoryTokenCount).equal(0);

    const lefTokens = await Sequelize.instance.tokensTfaRecovery.findAll({
      where: {
        userid: "1",
      },
    });
    expect(lefTokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT - 1);
    expect(tokens).to.be.deep.equal(lefTokens.map((item) => item.token));
  });
});
