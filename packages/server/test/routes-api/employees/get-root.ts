import {prepareApi} from "../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Web} from "../../../src";

describe("GET /employees", () => {
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
    await Employee.create({
      email: "moderator@example.com",
      language: "en",
      moderator: true,
      name: "aaa",
      phone: "+79123456780",
      registration,
    });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            admin: false,
            banned: false,
            email: "moderator@example.com",
            id: "2",
            language: "en",
            moderator: true,
            name: "aaa",
            phone: "+79123456780",
            registration: registration.toISOString(),
          },
          {
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
        ],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees`)
      .query({
        limit: "1",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            admin: false,
            banned: false,
            email: "moderator@example.com",
            id: "2",
            language: "en",
            moderator: true,
            name: "aaa",
            phone: "+79123456780",
            registration: registration.toISOString(),
          },
        ],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees`)
      .query({
        offset: "1",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
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
        ],
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees`)
      .query({
        limit: "aaa",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "limit" fails because ["limit" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees`)
      .query({
        offset: "aaa",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "offset" fails because ["offset" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees`)
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
      .get(`${Const.API_MOUNT_POINT}/employees`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/employees`)
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
      .get(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_ADMIN,
        message: "required admin",
      });
  });
});
