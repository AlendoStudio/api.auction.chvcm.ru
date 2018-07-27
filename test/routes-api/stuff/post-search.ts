import {reCaptchaMockAdapter} from "../../common";

import {
  BooleanUnitCodes,
  NotEmptyStringUnitCodes,
  ObjectUnitCodes,
  PgBigSerialUnitCodes,
  PgEnumUnitCodes,
  PgLimitUnitCodes,
  PgOffsetUnitCodes,
} from "@alendo/express-req-validator";

import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /stuff/search", () => {
  let token: string;
  beforeEach(async () => {
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
    for (let i = 0; i < 3; ++i) {
      await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    }
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: false,
        tr: {
          en: "Ebonite",
          ru: "Эбонит",
        },
      })
      .expect(204);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: {
          en: "Metal",
          ru: "Металл",
        },
      })
      .expect(204);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/3`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: {
          en: "Gold",
          ru: "Золото",
        },
      })
      .expect(204);
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("null code", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.code: value can't be null",
      });
  });

  it("null enabled", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.enabled: value can't be null",
      });
  });

  it("null id", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.id: value can't be null",
      });
  });

  it("null limit", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        limit: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.limit: value can't be null",
      });
  });

  it("null offset", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        offset: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.offset: value can't be null",
      });
  });

  it("null translation", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        translation: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.translation: value can't be null",
      });
  });

  it("wrong code", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "russian",
      })
      .expect(400, {
        code: PgEnumUnitCodes.WRONG_PG_ENUM,
        // tslint:disable max-line-length
        message: "body.code: value must be one of these values ['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fl', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu']",
      });
  });

  it("wrong enabled", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: "true",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.enabled: value must be boolean",
      });
  });

  it("wrong id", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "0",
      })
      .expect(400, {
        code: PgBigSerialUnitCodes.WRONG_PG_BIGSERIAL,
        message: "body.id: bigserial must be more or equal than 1",
      });
  });

  it("wrong limit", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        limit: "all",
      })
      .expect(400, {
        code: PgLimitUnitCodes.WRONG_PG_LIMIT,
        message: "body.limit: limit must contain only digits",
      });
  });

  it("wrong offset", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        offset: "all",
      })
      .expect(400, {
        code: PgOffsetUnitCodes.WRONG_PG_OFFSET,
        message: "body.offset: offset must contain only digits",
      });
  });

  it("wrong translation", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        translation: "",
      })
      .expect(400, {
        code: NotEmptyStringUnitCodes.WRONG_NOT_EMPTY_STRING,
        message: "body.translation: value must be not empty string",
      });
  });

  it("find by translation - gold", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "en",
        translation: "gol",
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "3",
            tr: {
              en: "Gold",
            },
          },
        ],
      });
  });

  it("find by translation - золото", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "ru",
        translation: "золото",
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "3",
            tr: {
              ru: "Золото",
            },
          },
        ],
      });
  });

  it("find by id - 1", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "1",
      })
      .expect(200, {
        stuffs: [
          {
            enabled: false,
            id: "1",
            tr: {
              en: "Ebonite",
              ru: "Эбонит",
            },
          },
        ],
      });
  });

  it("find by id - 2", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "2",
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "2",
            tr: {
              en: "Metal",
              ru: "Металл",
            },
          },
        ],
      });
  });

  it("find by id - 3", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "3",
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "3",
            tr: {
              en: "Gold",
              ru: "Золото",
            },
          },
        ],
      });
  });

  it("find by enabled - true [code - en]", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "en",
        enabled: true,
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "3",
            tr: {
              en: "Gold",
            },
          }, {
            enabled: true,
            id: "2",
            tr: {
              en: "Metal",
            },
          },
        ],
      });
  });

  it("find by enabled - true [code - ru]", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "ru",
        enabled: true,
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "3",
            tr: {
              ru: "Золото",
            },
          }, {
            enabled: true,
            id: "2",
            tr: {
              ru: "Металл",
            },
          },
        ],
      });
  });

  it("find by enabled - true [code - de]", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "de",
        enabled: true,
      })
      .expect(200, {
        stuffs: [],
      });
  });

  it("find by enabled - false", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: false,
      })
      .expect(200, {
        stuffs: [
          {
            enabled: false,
            id: "1",
            tr: {
              en: "Ebonite",
              ru: "Эбонит",
            },
          },
        ],
      });
  });

  it("find by enabled - true - limit 1 + offset 0", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: true,
        limit: 1,
        offset: 0,
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "2",
            tr: {
              en: "Metal",
              ru: "Металл",
            },
          },
        ],
      });
  });

  it("find by enabled - true - limit 1 + offset 1", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: true,
        limit: 1,
        offset: 1,
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "3",
            tr: {
              en: "Gold",
              ru: "Золото",
            },
          },
        ],
      });
  });

  it("find by enabled - true - limit 1 + offset 2", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: true,
        limit: 1,
        offset: 2,
      })
      .expect(200, {
        stuffs: [],
      });
  });

  it("find all - code en", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "en",
      })
      .expect(200, {
        stuffs: [
          {
            enabled: false,
            id: "1",
            tr: {
              en: "Ebonite",
            },
          }, {
            enabled: true,
            id: "3",
            tr: {
              en: "Gold",
            },
          }, {
            enabled: true,
            id: "2",
            tr: {
              en: "Metal",
            },
          },
        ],
      });
  });

  it("find all - code ru", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        code: "ru",
      })
      .expect(200, {
        stuffs: [
          {
            enabled: true,
            id: "3",
            tr: {
              ru: "Золото",
            },
          }, {
            enabled: true,
            id: "2",
            tr: {
              ru: "Металл",
            },
          }, {
            enabled: false,
            id: "1",
            tr: {
              ru: "Эбонит",
            },
          },
        ],
      });
  });

  it("find all - limit 2 + offset 3", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        limit: 2,
        offset: 3,
      })
      .expect(200, {stuffs: []});
  });
});
