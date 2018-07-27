import {reCaptchaMockAdapter} from "../../common";

import {
  EmailUnitCodes,
  NotEmptyStringUnitCodes,
  ObjectUnitCodes,
  PgEnumUnitCodes,
  PhoneUnitCodes,
} from "@alendo/express-req-validator";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as sinon from "sinon";
import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, EmailNotifications, Env, Recaptcha2, Sequelize, Web} from "../../../src";

describe("POST /employee", () => {
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
  });

  it("null email", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: null,
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.email: value can't be null",
      });
  });

  it("null language", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: null,
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.language: value can't be null",
      });
  });

  it("null name", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        name: null,
        phone: "+79123456780",
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.name: value can't be null",
      });
  });

  it("null phone", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        name: "admin",
        phone: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.phone: value can't be null",
      });
  });

  it("missing email", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        language: "ru",
        name: "admin",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.email: missing value",
      });
  });

  it("missing language", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        name: "admin",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.language: missing value",
      });
  });

  it("missing name", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.name: missing value",
      });
  });

  it("missing phone", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        name: "admin",
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.phone: missing value",
      });
  });

  it("wrong email", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example",
        language: "ru",
        name: "moderator",
        phone: "+79123456789",
      })
      .expect(400, {
        code: EmailUnitCodes.WRONG_EMAIL,
        message: `body.email: email must be in format "user@example.com"`,
      });
  });

  it("wrong language", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "russian",
        name: "moderator",
        phone: "+79123456789",
      })
      .expect(400, {
        code: PgEnumUnitCodes.WRONG_PG_ENUM,
        // tslint:disable max-line-length
        message: "body.language: value must be one of these values ['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fl', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu']",
      });
  });

  it("wrong name", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "",
        phone: "+79123456789",
      })
      .expect(400, {
        code: NotEmptyStringUnitCodes.WRONG_NOT_EMPTY_STRING,
        message: "body.name: value must be not empty string",
      });
  });

  it("wrong phone", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "admin",
        phone: "+7912",
      })
      .expect(400, {
        code: PhoneUnitCodes.WRONG_PHONE,
        message: "body.phone: invalid phone format for locale any",
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_ADMIN,
        message: "required admin",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("400 - user with same email and phone already exists", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456789",
      })
      .expect(400, {
        code: ApiCodes.DB_USER_FOUND_BY_EMAIL_AND_PHONE,
        message: "user with same email and phone already exists",
      });
  });

  it("400 - user with same email already exists", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.DB_USER_FOUND_BY_EMAIL,
        message: "user with same email already exists",
      });
  });

  it("400 - user with same phone already exists", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456789",
      })
      .expect(400, {
        code: ApiCodes.DB_USER_FOUND_BY_PHONE,
        message: "user with same phone already exists",
      });
  });

  it("correct - ru email", async () => {
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
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
    const employee = await Sequelize.instance.employee.findAndCountAll({
      where: {
        admin: false,
      },
    });
    expect(employee.count).equal(1);
    expect(employee.rows[0].id).equal("2");
    expect(employee.rows[0].admin).equal(false);
    expect(employee.rows[0].moderator).equal(false);
    expect(employee.rows[0].email).equal("moderator@example.com");
    expect(employee.rows[0].name).equal("moderator");
    expect(employee.rows[0].language).equal("ru");
    expect(employee.rows[0].phone).equal("+79123456780");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Добро пожаловать в семью сотрудников!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });

  it("correct - en email", async () => {
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "en",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(200, {
        id: "2",
      });
    const employee = await Sequelize.instance.employee.findAndCountAll({
      where: {
        admin: false,
      },
    });
    expect(employee.count).equal(1);
    expect(employee.rows[0].id).equal("2");
    expect(employee.rows[0].admin).equal(false);
    expect(employee.rows[0].moderator).equal(false);
    expect(employee.rows[0].email).equal("moderator@example.com");
    expect(employee.rows[0].name).equal("moderator");
    expect(employee.rows[0].language).equal("en");
    expect(employee.rows[0].phone).equal("+79123456780");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Welcome to the family of employees!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });

  it("correct - other email", async () => {
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "de",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(200, {
        id: "2",
      });
    const employee = await Sequelize.instance.employee.findAndCountAll({
      where: {
        admin: false,
      },
    });
    expect(employee.count).equal(1);
    expect(employee.rows[0].id).equal("2");
    expect(employee.rows[0].admin).equal(false);
    expect(employee.rows[0].moderator).equal(false);
    expect(employee.rows[0].email).equal("moderator@example.com");
    expect(employee.rows[0].name).equal("moderator");
    expect(employee.rows[0].language).equal("de");
    expect(employee.rows[0].phone).equal("+79123456780");

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Welcome to the family of employees!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("moderator@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
    expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
  });
});
