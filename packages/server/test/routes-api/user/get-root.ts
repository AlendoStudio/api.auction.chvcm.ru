import {prepareApi} from "../../common";

import {expect} from "chai";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Employee,
  Entity,
  Jwt,
  Web,
} from "../../../src";

describe("GET /user", () => {
  prepareApi();

  let tokenEmployee: string;
  let tokenEntity: string;
  beforeEach(async () => {
    await Employee.create({
      admin: true,
      email: "admin@example.com",
      language: "ru",
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
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(201)).body.token;
  });

  describe("Success 200", () => {
    it("employee", async () => {
      const res = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .send({
          email: "admin@example.com",
          password: "super mario",
        })
        .expect(200);
      expect(res.body).have.keys(
        "admin",
        "email",
        "id",
        "language",
        "moderator",
        "name",
        "phone",
        "registration",
        "tfa",
        "type",
      );
      expect(res.body.admin).equal(true);
      expect(res.body.email).equal("admin@example.com");
      expect(res.body.id).equal("1");
      expect(res.body.language).equal("ru");
      expect(res.body.moderator).equal(false);
      expect(res.body.name).equal("admin");
      expect(res.body.phone).equal("+79123456789");
      expect(new Date(res.body.registration)).be.a("Date");
      expect(res.body.tfa).equal(false);
      expect(res.body.type).equal("employee");
    });

    it("entity", async () => {
      const res = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .send({
          email: "entity@example.com",
          password: "super mario",
        })
        .expect(200);
      expect(res.body).have.keys(
        "ceo",
        "email",
        "id",
        "itn",
        "language",
        "name",
        "phone",
        "psrn",
        "registration",
        "tfa",
        "type",
        "verified",
      );
      expect(res.body.ceo).equal("Директор: Гордон Андрей Анатольевич");
      expect(res.body.email).equal("primer@yandex.ru");
      expect(res.body.id).equal("2");
      expect(res.body.itn).equal("3664069397");
      expect(res.body.language).equal("ru");
      expect(res.body.name).equal(`ООО "ПРИМЕР"`);
      expect(res.body.phone).equal("+79123456780");
      expect(res.body.psrn).equal("1053600591197");
      expect(new Date(res.body.registration)).be.a("Date");
      expect(res.body.tfa).equal(false);
      expect(res.body.type).equal("entity");
      expect(res.body.verified).equal(false);
    });
  });

  it("Unauthorized 401 ", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/user`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/user`)
      .set(
        "Authorization",
        `Bearer ${await Jwt.signUser({
          id: "3",
          type: Const.USER_TYPE_EMPLOYEE,
        })}`,
      )
      .expect(401, {
        code: ApiCodes.EMPLOYEE_NOT_FOUND_BY_ID,
        message: "employee with same id not found",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/user`)
      .set(
        "Authorization",
        `Bearer ${await Jwt.signUser({
          id: "3",
          type: Const.USER_TYPE_ENTITY,
        })}`,
      )
      .expect(401, {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
        message: "entity with same id not found",
      });

    await Employee.update(
      {
        banned: true,
      },
      {
        where: {
          id: "1",
        },
      },
    );
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });

    await Entity.update(
      {
        banned: true,
      },
      {
        where: {
          id: "2",
        },
      },
    );
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });
});
