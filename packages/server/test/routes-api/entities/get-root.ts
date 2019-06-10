import {prepareApi} from "../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Entity, Web} from "../../../src";

describe("GET /entities", () => {
  prepareApi();

  let token: string;
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
      .expect(201);

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "A Ceo",
        email: "a@example.com",
        itn: "7704595727",
        language: "en",
        name: "aaa",
        password: "super mario",
        phone: "+79123456781",
        psrn: "1033700070678",
      })
      .expect(201);

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

    await Entity.update(
      {
        banned: true,
        registration,
      },
      {
        where: {
          id: "3",
        },
      },
    );

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            banned: true,
            ceo: "A Ceo",
            email: "a@example.com",
            id: "3",
            itn: "7704595727",
            language: "en",
            name: "aaa",
            phone: "+79123456781",
            psrn: "1033700070678",
            registration: registration.toISOString(),
            verified: false,
          },
          {
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
        ],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .query({
        limit: "1",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
            banned: true,
            ceo: "A Ceo",
            email: "a@example.com",
            id: "3",
            itn: "7704595727",
            language: "en",
            name: "aaa",
            phone: "+79123456781",
            psrn: "1033700070678",
            registration: registration.toISOString(),
            verified: false,
          },
        ],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .query({
        offset: "1",
      })
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        data: [
          {
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
        ],
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .set("Authorization", `Bearer ${token}`)
      .query({
        limit: "aaa",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "limit" fails because ["limit" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .set("Authorization", `Bearer ${token}`)
      .query({
        offset: "aaa",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "offset" fails because ["offset" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .set("Authorization", `Bearer ${token}`)
      .query({
        extraField: true,
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities`)
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
      .get(`${Const.API_MOUNT_POINT}/entities`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });
});
