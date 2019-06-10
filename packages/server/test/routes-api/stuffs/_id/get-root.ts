import {prepareApi} from "../../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Web} from "../../../../src";

describe("GET /stuffs/:id", () => {
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
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "piece",
      })
      .expect(201, {
        id: "1",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: {
          amountType: "piece",
          enabled: true,
          id: "1",
        },
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/aaa`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        code: ApiCodes.STUFF_NOT_FOUND_BY_ID,
        message: "stuff with same id not found",
      });
  });
});
