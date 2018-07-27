import {reCaptchaMockAdapter} from "../../common";

import {PgBigSerialUnitCodes} from "@alendo/express-req-validator";

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

describe("GET /attachment/:id", () => {
  let tokenEntity: string;
  let token: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    tokenEntity = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signup`)
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
    token = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
  });

  it("required moderator", async () => {
    await Sequelize.instance.employee.update({
      moderator: false,
    }, {
      where: {
        id: "2",
      },
    });
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("required moderator (entity token)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment/1`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment/1`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment/1`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("wrong id", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment/0`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: PgBigSerialUnitCodes.WRONG_PG_BIGSERIAL,
        message: "params.id: bigserial must be more or equal than 1",
      });
  });

  it("correct", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        url: "https://example.com/attachment.zip",
      })
      .expect(204);
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        url: "https://example.com/attachment.zip",
      });
  });

  it("empty url", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {});
  });
});
