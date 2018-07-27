import {reCaptchaMockAdapter} from "../../common";

import {
  BooleanUnitCodes,
  NotEmptyStringUnitCodes,
  ObjectUnitCodes,
  PgBigSerialUnitCodes,
  PgEnumUnitCodes,
} from "@alendo/express-req-validator";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  IStuffInstance, IStuffTranslation,
  IStuffTranslationsInstance,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /stuff/:id", () => {
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("null enabled", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.enabled: value can't be null",
      });
  });

  it("null tr", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.tr: value can't be null",
      });
  });

  it("null tr.code", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: {
          ru: null,
        },
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.tr.ru: value can't be null",
      });
  });

  it("wrong id", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/0`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: PgBigSerialUnitCodes.WRONG_PG_BIGSERIAL,
        message: "params.id: bigserial must be more or equal than 1",
      });
  });

  it("wrong enabled", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: "true",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.enabled: value must be boolean",
      });
  });

  it("wrong tr", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: JSON.stringify({
          ru: "Золото",
        }),
      })
      .expect(400, {
        code: ObjectUnitCodes.WRONG_OBJECT,
        message: "body.tr: value must be object",
      });
  });

  it("wrong tr.code", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: {
          ru: "",
        },
      })
      .expect(400, {
        code: NotEmptyStringUnitCodes.WRONG_NOT_EMPTY_STRING,
        message: "body.tr.ru: value must be not empty string",
      });
  });

  it("wrong tr[code]", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: {
          russian: "Золото",
        },
      })
      .expect(400, {
        code: PgEnumUnitCodes.WRONG_PG_ENUM,
        // tslint:disable max-line-length
        message: "body.tr[russian]: value must be one of these values ['aa', 'ab', 'ae', 'af', 'ak', 'am', 'an', 'ar', 'as', 'av', 'ay', 'az', 'ba', 'be', 'bg', 'bh', 'bi', 'bm', 'bn', 'bo', 'br', 'bs', 'ca', 'ce', 'ch', 'co', 'cr', 'cs', 'cu', 'cv', 'cy', 'da', 'de', 'dv', 'dz', 'ee', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'ff', 'fi', 'fj', 'fl', 'fo', 'fr', 'fy', 'ga', 'gd', 'gl', 'gn', 'gu', 'gv', 'ha', 'he', 'hi', 'ho', 'hr', 'ht', 'hu', 'hy', 'hz', 'ia', 'id', 'ie', 'ig', 'ii', 'ik', 'io', 'is', 'it', 'iu', 'ja', 'jv', 'ka', 'kg', 'ki', 'kj', 'kk', 'kl', 'km', 'kn', 'ko', 'kr', 'ks', 'ku', 'kv', 'kw', 'ky', 'la', 'lb', 'lg', 'li', 'ln', 'lo', 'lt', 'lu', 'lv', 'mg', 'mh', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'na', 'nb', 'nd', 'ne', 'ng', 'nl', 'nn', 'no', 'nr', 'nv', 'ny', 'oc', 'oj', 'om', 'or', 'os', 'pa', 'pi', 'pl', 'ps', 'pt', 'qu', 'rm', 'rn', 'ro', 'ru', 'rw', 'sa', 'sc', 'sd', 'se', 'sg', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'ss', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'ti', 'tk', 'tl', 'tn', 'to', 'tr', 'ts', 'tt', 'tw', 'ty', 'ug', 'uk', 'ur', 'uz', 've', 'vi', 'vo', 'wa', 'wo', 'xh', 'yi', 'yo', 'za', 'zh', 'zu']",
      });
  });

  it("required moderator", async () => {
    await Sequelize.instance.employee.update({
      moderator: false,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("correct", async () => {
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
    const stuff = await Sequelize.instance.stuff.findById("1", {
      include: [{
        model: Sequelize.instance.stuffTranslations,
      }],
      order: [[Sequelize.instance.stuffTranslations, "code", "ASC"]],
    }) as IStuffInstance;
    expect(stuff.enabled).equal(false);
    expect((stuff as any).stuff_translations as IStuffTranslationsInstance[]).have.lengthOf(2);
    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[0].stuffid).equal("1");
    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[1].stuffid).equal("1");

    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[0].code).equal("en");
    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[1].code).equal("ru");

    const translationEn = ((stuff as any).stuff_translations as IStuffTranslationsInstance[])[0].translation as IStuffTranslation;
    const translationRu = ((stuff as any).stuff_translations as IStuffTranslationsInstance[])[1].translation as IStuffTranslation;
    [translationEn, translationEn].map((translation) => {
      expect(translation).be.a("Object");
      expect(translation).have.keys("title");
    });
    expect(translationEn.title).equal("Ebonite");
    expect(translationRu.title).equal("Эбонит");
  });

  it("double update tr", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: {
          de: "Gold",
          en: "Gold",
          ru: "Золото",
        },
      })
      .expect(204);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tr: {
          en: "Ebonite",
          ru: "Эбонит",
        },
      })
      .expect(204);
    const stuff = await Sequelize.instance.stuff.findById("1", {
      include: [{
        model: Sequelize.instance.stuffTranslations,
      }],
      order: [[Sequelize.instance.stuffTranslations, "code", "ASC"]],
    }) as IStuffInstance;
    expect(stuff.enabled).equal(true);
    expect((stuff as any).stuff_translations as IStuffTranslationsInstance[]).have.lengthOf(2);
    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[0].stuffid).equal("1");
    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[1].stuffid).equal("1");

    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[0].code).equal("en");
    expect(((stuff as any).stuff_translations as IStuffTranslationsInstance[])[1].code).equal("ru");

    const translationEn = ((stuff as any).stuff_translations as IStuffTranslationsInstance[])[0].translation as IStuffTranslation;
    const translationRu = ((stuff as any).stuff_translations as IStuffTranslationsInstance[])[1].translation as IStuffTranslation;
    [translationEn, translationEn].map((translation) => {
      expect(translation).be.a("Object");
      expect(translation).have.keys("title");
    });
    expect(translationEn.title).equal("Ebonite");
    expect(translationRu.title).equal("Эбонит");
  });
});
