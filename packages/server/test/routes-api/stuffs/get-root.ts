import {prepareApi} from "../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Web} from "../../../src";

describe("GET /stuffs", () => {
  prepareApi();

  let token: string;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      moderator: true,
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
      tfa: false,
    });

    token = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(200)).body.token;
  });

  it("Success 200", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [],
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "kg",
      })
      .expect(201, {
        id: "1",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "piece",
      })
      .expect(201, {
        id: "2",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            amountType: "kg",
            enabled: true,
            id: "1",
          },
          {
            amountType: "piece",
            enabled: true,
            id: "2",
          },
        ],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .query({
        limit: "1",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            amountType: "kg",
            enabled: true,
            id: "1",
          },
        ],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .query({
        offset: "1",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            amountType: "piece",
            enabled: true,
            id: "2",
          },
        ],
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .query({
        limit: "aaa",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "limit" fails because ["limit" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .query({
        offset: "aaa",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "offset" fails because ["offset" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .query({
        extraField: true,
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });
});
