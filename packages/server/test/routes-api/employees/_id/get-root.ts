import {prepareApi} from "../../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Web} from "../../../../src";

describe("GET /employees/:id", () => {
  prepareApi();

  let token: string;
  let registration: Date;
  beforeEach(async () => {
    registration = new Date();

    await Employee.create({
      admin: true,
      email: "admin@example.com",
      language: "ru",
      name: "zzz",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
      registration,
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
      .get(`${Const.API_MOUNT_POINT}/employees/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: {
          admin: true,
          banned: false,
          email: "admin@example.com",
          id: "1",
          language: "ru",
          moderator: false,
          name: "zzz",
          phone: "+79123456789",
          registration: registration.toISOString(),
        },
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees/aaa`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees/1`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees/1`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await Employee.update(
      {
        admin: false,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_ADMIN,
        message: "required admin",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees/999`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        code: ApiCodes.EMPLOYEE_NOT_FOUND_BY_ID,
        message: "employee with same id not found",
      });
  });
});
