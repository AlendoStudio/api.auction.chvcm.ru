import {reCaptchaMockAdapter} from "../../common";

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

describe("GET /attachment", () => {
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
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_ENTITY,
        message: "required entity",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("correct", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        url: "https://example.com/attachment.zip",
      })
      .expect(204);
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        url: "https://example.com/attachment.zip",
      });
  });

  it("empty url", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/attachment`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {});
  });
});
