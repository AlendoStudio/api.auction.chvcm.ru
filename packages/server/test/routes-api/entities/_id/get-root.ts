import {prepareApi} from "../../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Entity, Web} from "../../../../src";

describe("GET /entities/:id", () => {
  prepareApi();

  let tokenEmployee: string;
  let tokenEntity: string;
  beforeEach(async () => {
    await Employee.create({
      admin: true,
      email: "admin@example.com",
      language: "ru",
      moderator: true,
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
    });

    tokenEmployee = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(200)).body.token;

    tokenEntity = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Z Ceo",
        email: "z@example.com",
        itn: "7627019317",
        language: "ru",
        name: "zzz",
        password: "super mario",
        phone: "+79123456780",
        psrn: "1027601593271",
      })
      .expect(201)).body.token;
  });

  it("Success 200", async () => {
    const registration = new Date();

    await Entity.update(
      {
        registration,
        verified: true,
      },
      {
        where: {
          id: "2",
        },
      },
    );

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(200, {
        data: {
          banned: false,
          ceo: "Z Ceo",
          email: "z@example.com",
          id: "2",
          itn: "7627019317",
          language: "ru",
          name: "zzz",
          phone: "+79123456780",
          psrn: "1027601593271",
          registration: registration.toISOString(),
          verified: true,
        },
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(200, {
        data: {
          banned: false,
          ceo: "Z Ceo",
          email: "z@example.com",
          id: "2",
          itn: "7627019317",
          language: "ru",
          name: "zzz",
          phone: "+79123456780",
          psrn: "1027601593271",
          registration: registration.toISOString(),
          verified: true,
        },
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/aaa`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .query({
        limit: "aaa",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await Employee.update(
      {
        moderator: false,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR,
        message: "required entity with same id or moderator",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/1`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR,
        message: "required entity with same id or moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/999`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(404, {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
        message: "entity with same id not found",
      });
  });
});
