import {reCaptchaMockAdapter} from "../common";

import {EmailUnitCodes, ObjectUnitCodes, ZxcvbnUnitCodes} from "@alendo/express-req-validator";

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
  Jwt,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../src";

describe("POST /signin", () => {
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

  it("wrong reCaptcha", async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: false,
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .expect(401, {
        code: ApiCodes.WRONG_RECAPTCHA,
        message: "FUCK YOU BOT!",
      });
  });

  describe("with tfa", () => {
    beforeEach(async () => {
      await Sequelize.instance.employee.update({
        tfa: true,
      }, {
        where: {
          id: "1",
        },
      });
    });

    it("user not found - unknown email", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.xxx",
          password: "super duper password",
        })
        .expect(401, {
          code: ApiCodes.DB_USER_NOT_FOUND,
          message: "user with same email and password not found",
        });
      sinon.assert.notCalled(spyMail);
    });

    it("user not found - unknown password", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "buper duper password",
        })
        .expect(401, {
          code: ApiCodes.DB_USER_NOT_FOUND,
          message: "user with same email and password not found",
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
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(401, {
          code: ApiCodes.BANNED,
          message: "user was banned",
        });
      sinon.assert.notCalled(spyMail);
    });

    it("400 Bad Request - email", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example",
          password: "super duper password",
        })
        .expect(400, {
          code: EmailUnitCodes.WRONG_EMAIL,
          message: `body.email: email must be in format "user@example.com"`,
        });
    });

    it("400 Bad Request - password", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "",
        })
        .expect(400, {
          code: ZxcvbnUnitCodes.WRONG_ZXCVBN,
          message: `body.password: password minimum score must be >= ${Const.MINIMUM_PASSWORD_SCORE}`,
        });
    });

    it("400 OBJECT_MISSING_KEY - email", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({})
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_MISSING_KEY,
          message: "body.email: missing value",
        });
    });

    it("400 OBJECT_MISSING_KEY - password", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
        })
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_MISSING_KEY,
          message: "body.password: missing value",
        });
    });

    it("400 OBJECT_NULL_VALUE - email", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: null,
          password: "super duper password",
        })
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_NULL_VALUE,
          message: "body.email: value can't be null",
        });
    });

    it("400 OBJECT_NULL_VALUE - password", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: null,
        })
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_NULL_VALUE,
          message: "body.password: value can't be null",
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
      const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(200);
      expect(res.body).to.have.keys("token", "tfa", "expires");
      expect(res.body.token).be.a("string");
      expect(res.body.tfa).be.a("boolean");
      expect(new Date(res.body.expires)).be.a("Date");
      expect(Date.now() - new Date(res.body.expires).getTime() - Const.TOKENS_TFA_PURGATORY_EXPIRESIN)
        .lessThan(1000 * 2);
      expect(res.body.tfa).equal(true);

      sinon.assert.calledOnce(spyMail);
      expect(spyMail.args[0][0].originalMessage.subject).equal("Попытка входа в систему!");
      expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
      expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
      expect(spyMail.args[0][0].originalMessage.html).contains("admin");
      expect(spyMail.args[0][0].originalMessage.text).contains("admin");

      const tokensCount = await Sequelize.instance.tokensTfaPurgatory.count({
        where: {
          token: res.body.token,
        },
      });
      expect(tokensCount).equal(1);
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
      const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(200);
      expect(res.body).to.have.keys("token", "tfa", "expires");
      expect(res.body.token).be.a("string");
      expect(res.body.tfa).be.a("boolean");
      expect(new Date(res.body.expires)).be.a("Date");
      expect(Date.now() - new Date(res.body.expires).getTime() - Const.TOKENS_TFA_PURGATORY_EXPIRESIN)
        .lessThan(1000 * 2);
      expect(res.body.tfa).equal(true);

      sinon.assert.calledOnce(spyMail);
      expect(spyMail.args[0][0].originalMessage.subject).equal("Attempting to login!");
      expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
      expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
      expect(spyMail.args[0][0].originalMessage.html).contains("admin");
      expect(spyMail.args[0][0].originalMessage.text).contains("admin");

      const tokensCount = await Sequelize.instance.tokensTfaPurgatory.count({
        where: {
          token: res.body.token,
        },
      });
      expect(tokensCount).equal(1);
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
      const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(200);
      expect(res.body).to.have.keys("token", "tfa", "expires");
      expect(res.body.token).be.a("string");
      expect(res.body.tfa).be.a("boolean");
      expect(new Date(res.body.expires)).be.a("Date");
      expect(Date.now() - new Date(res.body.expires).getTime() - Const.TOKENS_TFA_PURGATORY_EXPIRESIN)
        .lessThan(1000 * 2);
      expect(res.body.tfa).equal(true);

      sinon.assert.calledOnce(spyMail);
      expect(spyMail.args[0][0].originalMessage.subject).equal("Attempting to login!");
      expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
      expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
      expect(spyMail.args[0][0].originalMessage.html).contains("admin");
      expect(spyMail.args[0][0].originalMessage.text).contains("admin");

      const tokensCount = await Sequelize.instance.tokensTfaPurgatory.count({
        where: {
          token: res.body.token,
        },
      });
      expect(tokensCount).equal(1);
    });
  });

  describe("without tfa", () => {
    beforeEach(async () => {
      await Sequelize.instance.employee.update({
        tfa: false,
      }, {
        where: {
          id: "1",
        },
      });
    });

    it("user not found - unknown email", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.xxx",
          password: "super duper password",
        })
        .expect(401, {
          code: ApiCodes.DB_USER_NOT_FOUND,
          message: "user with same email and password not found",
        });
      sinon.assert.notCalled(spyMail);
    });

    it("user not found - unknown password", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "buper duper password",
        })
        .expect(401, {
          code: ApiCodes.DB_USER_NOT_FOUND,
          message: "user with same email and password not found",
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
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(401, {
          code: ApiCodes.BANNED,
          message: "user was banned",
        });
      sinon.assert.notCalled(spyMail);
    });

    it("400 Bad Request - email", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example",
          password: "super duper password",
        })
        .expect(400, {
          code: EmailUnitCodes.WRONG_EMAIL,
          message: `body.email: email must be in format "user@example.com"`,
        });
    });

    it("400 Bad Request - password", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "",
        })
        .expect(400, {
          code: ZxcvbnUnitCodes.WRONG_ZXCVBN,
          message: `body.password: password minimum score must be >= ${Const.MINIMUM_PASSWORD_SCORE}`,
        });
    });

    it("400 OBJECT_MISSING_KEY - email", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({})
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_MISSING_KEY,
          message: "body.email: missing value",
        });
    });

    it("400 OBJECT_MISSING_KEY - password", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
        })
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_MISSING_KEY,
          message: "body.password: missing value",
        });
    });

    it("400 OBJECT_NULL_VALUE - email", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: null,
          password: "super duper password",
        })
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_NULL_VALUE,
          message: "body.email: value can't be null",
        });
    });

    it("400 OBJECT_NULL_VALUE - password", async () => {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: null,
        })
        .expect(400, {
          code: ObjectUnitCodes.OBJECT_NULL_VALUE,
          message: "body.password: value can't be null",
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
      const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(200);
      expect(res.body).to.have.keys("token", "tfa");
      expect(res.body.token).be.a("string");
      expect(res.body.tfa).be.a("boolean");
      expect(res.body.tfa).equal(false);
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
      const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(200);
      expect(res.body).to.have.keys("token", "tfa");
      expect(res.body.token).be.a("string");
      expect(res.body.tfa).be.a("boolean");
      expect(res.body.tfa).equal(false);
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
      const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super duper password",
        })
        .expect(200);
      expect(res.body).to.have.keys("token", "tfa");
      expect(res.body.token).be.a("string");
      expect(res.body.tfa).be.a("boolean");
      expect(res.body.tfa).equal(false);
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
    });
  });
});
