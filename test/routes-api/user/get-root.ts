import {reCaptchaMockAdapter} from "../../common";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Jwt,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("GET /user", () => {
  let tokenEmployee: string;
  let tokenEntity: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
      admin: true,
      email: "admin@example.com",
      language: "ru",
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
    tokenEntity = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signup`)
      .send({
        ceo: "Catherine Havasi",
        email: "entity@example.com",
        itn: 76_27_01931_7,
        language: "ru",
        name: "Luminoso",
        password: "super duper password",
        phone: "+16176829056",
        psrn: 1_02_76_01_59327_1,
      })
      .expect(200)).body.token;
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("401 DB_EMPLOYEE_NOT_FOUND_BY_ID", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${await Jwt.signUser({
        id: "3",
        type: Const.USER_TYPE_EMPLOYEE,
      })}`)
      .expect(401, {
        code: ApiCodes.DB_EMPLOYEE_NOT_FOUND_BY_ID,
        message: "employee with same id not found",
      });
  });

  it("401 DB_ENTITY_NOT_FOUND_BY_ID", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${await Jwt.signUser({
        id: "3",
        type: Const.USER_TYPE_ENTITY,
      })}`)
      .expect(401, {
        code: ApiCodes.DB_ENTITY_NOT_FOUND_BY_ID,
        message: "entity with same id not found",
      });
  });

  it("401 BANNED - employee", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });

  it("401 BANNED - entity", async () => {
    await Sequelize.instance.entity.update({
      banned: true,
    }, {
      where: {
        id: "2",
      },
    });
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });

  it("employee", async () => {
    const res = (await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200));
    expect(res.body).have.keys("admin", "email", "id", "language", "moderator",
      "name", "phone", "registration", "tfa", "type");
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
    const res = (await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        email: "entity@example.com",
        password: "super duper password",
      })
      .expect(200));
    expect(res.body).have.keys("ceo", "email", "id", "itn", "language",
      "name", "phone", "psrn", "registration", "tfa", "type", "verified");
    expect(res.body.ceo).equal("Catherine Havasi");
    expect(res.body.email).equal("entity@example.com");
    expect(res.body.id).equal("2");
    expect(res.body.itn).equal(Number(76_27_01931_7).toString());
    expect(res.body.language).equal("ru");
    expect(res.body.name).equal("Luminoso");
    expect(res.body.phone).equal("+16176829056");
    expect(res.body.psrn).equal(Number(1_02_76_01_59327_1).toString());
    expect(new Date(res.body.registration)).be.a("Date");
    expect(res.body.tfa).equal(false);
    expect(res.body.type).equal("entity");
    expect(res.body.verified).equal(false);
  });
});
