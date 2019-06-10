import {prepareApi} from "../../../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Web} from "../../../../../src";

describe("GET /stuffs/:id/translations", () => {
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
        amountType: "kg",
      })
      .expect(201, {
        id: "1",
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/ru`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Описание",
        title: "Золото",
      })
      .expect(204);

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gold",
      })
      .expect(204);

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/1/translations`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            code: "en",
            description: "",
            title: "Gold",
          },
          {
            code: "ru",
            description: "Описание",
            title: "Золото",
          },
        ],
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/aaa/translations`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
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

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/stuffs/1/translations`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        code: ApiCodes.STUFF_NOT_FOUND_BY_ID,
        message: "stuff with same id not found",
      });
  });
});
