import {reCaptchaMockAdapter} from "../../common";

import {
  BooleanUnitCodes,
  ObjectUnitCodes,
  PgBigSerialUnitCodes,
  PgLimitUnitCodes,
  PgOffsetUnitCodes,
} from "@alendo/express-req-validator";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {
  Bcrypt,
  Const,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /employee/search", () => {
  let token: string;
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
    token = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(200, {
        id: "2",
      });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: true,
      })
      .expect(204);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "employee@example.com",
        language: "ru",
        name: "employee",
        phone: "+79123456781",
      })
      .expect(200, {
        id: "3",
      });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/3`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(204);
  });

  it("null admin", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.admin: value can't be null",
      });
  });

  it("null banned", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.banned: value can't be null",
      });
  });

  it("null id", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.id: value can't be null",
      });
  });

  it("null limit", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        limit: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.limit: value can't be null",
      });
  });

  it("null moderator", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.moderator: value can't be null",
      });
  });

  it("null offset", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        offset: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.offset: value can't be null",
      });
  });

  it("wrong admin", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: "true",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.admin: value must be boolean",
      });
  });

  it("wrong banned", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: "false",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.banned: value must be boolean",
      });
  });

  it("wrong id", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "0",
      })
      .expect(400, {
        code: PgBigSerialUnitCodes.WRONG_PG_BIGSERIAL,
        message: "body.id: bigserial must be more or equal than 1",
      });
  });

  it("wrong limit", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        limit: "",
      })
      .expect(400, {
        code: PgLimitUnitCodes.WRONG_PG_LIMIT,
        message: "body.limit: limit must contain only digits",
      });
  });

  it("wrong moderator", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: "false",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.moderator: value must be boolean",
      });
  });

  it("wrong offset", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        offset: "",
      })
      .expect(400, {
        code: PgOffsetUnitCodes.WRONG_PG_OFFSET,
        message: "body.offset: offset must contain only digits",
      });
  });

  it("find all", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(3);
    for (let i = 0; i < 3; ++i) {
      expect(res.body.employees[0]).have.keys(
        "admin", "banned", "email", "id", "moderator", "name", "phone", "registration");
      expect(new Date(res.body.employees[i].registration)).be.a("Date");
      expect(res.body.employees[i].id).equal(`${i + 1}`);
    }
    expect(res.body.employees[0].admin).equal(true);
    expect(res.body.employees[1].admin).equal(false);
    expect(res.body.employees[2].admin).equal(false);

    expect(res.body.employees[0].banned).equal(false);
    expect(res.body.employees[1].banned).equal(false);
    expect(res.body.employees[2].banned).equal(true);

    expect(res.body.employees[0].email).equal("admin@example.com");
    expect(res.body.employees[1].email).equal("moderator@example.com");
    expect(res.body.employees[2].email).equal("employee@example.com");

    expect(res.body.employees[0].moderator).equal(false);
    expect(res.body.employees[1].moderator).equal(true);
    expect(res.body.employees[2].moderator).equal(false);

    expect(res.body.employees[0].name).equal("admin");
    expect(res.body.employees[1].name).equal("moderator");
    expect(res.body.employees[2].name).equal("employee");

    expect(res.body.employees[0].phone).equal("+79123456789");
    expect(res.body.employees[1].phone).equal("+79123456780");
    expect(res.body.employees[2].phone).equal("+79123456781");
  });

  it("find all - limit 2 offset 0", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        limit: 2,
        offset: 0,
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(2);
    for (let i = 0; i < 2; ++i) {
      expect(res.body.employees[0]).have.keys(
        "admin", "banned", "email", "id", "moderator", "name", "phone", "registration");
      expect(new Date(res.body.employees[i].registration)).be.a("Date");
      expect(res.body.employees[i].id).equal(`${i + 1}`);
    }
    expect(res.body.employees[0].admin).equal(true);
    expect(res.body.employees[1].admin).equal(false);

    expect(res.body.employees[0].banned).equal(false);
    expect(res.body.employees[1].banned).equal(false);

    expect(res.body.employees[0].email).equal("admin@example.com");
    expect(res.body.employees[1].email).equal("moderator@example.com");

    expect(res.body.employees[0].moderator).equal(false);
    expect(res.body.employees[1].moderator).equal(true);

    expect(res.body.employees[0].name).equal("admin");
    expect(res.body.employees[1].name).equal("moderator");

    expect(res.body.employees[0].phone).equal("+79123456789");
    expect(res.body.employees[1].phone).equal("+79123456780");
  });

  it("find all - limit 2 offset 1", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        limit: 2,
        offset: 1,
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(2);
    for (let i = 0; i < 2; ++i) {
      expect(res.body.employees[0]).have.keys(
        "admin", "banned", "email", "id", "moderator", "name", "phone", "registration");
      expect(new Date(res.body.employees[i].registration)).be.a("Date");
      expect(res.body.employees[i].id).equal(`${i + 2}`);
    }
    expect(res.body.employees[0].admin).equal(false);
    expect(res.body.employees[1].admin).equal(false);

    expect(res.body.employees[0].banned).equal(false);
    expect(res.body.employees[1].banned).equal(true);

    expect(res.body.employees[0].email).equal("moderator@example.com");
    expect(res.body.employees[1].email).equal("employee@example.com");

    expect(res.body.employees[0].moderator).equal(true);
    expect(res.body.employees[1].moderator).equal(false);

    expect(res.body.employees[0].name).equal("moderator");
    expect(res.body.employees[1].name).equal("employee");

    expect(res.body.employees[0].phone).equal("+79123456780");
    expect(res.body.employees[1].phone).equal("+79123456781");
  });

  it("find by id", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: "1",
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(1);
    expect(new Date(res.body.employees[0].registration)).be.a("Date");
    expect(res.body.employees[0].id).equal("1");
    expect(res.body.employees[0].admin).equal(true);
    expect(res.body.employees[0].banned).equal(false);
    expect(res.body.employees[0].email).equal("admin@example.com");
    expect(res.body.employees[0].moderator).equal(false);
    expect(res.body.employees[0].name).equal("admin");
    expect(res.body.employees[0].phone).equal("+79123456789");
  });

  it("find all admins", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: true,
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(1);
    expect(new Date(res.body.employees[0].registration)).be.a("Date");
    expect(res.body.employees[0].id).equal("1");
    expect(res.body.employees[0].admin).equal(true);
    expect(res.body.employees[0].banned).equal(false);
    expect(res.body.employees[0].email).equal("admin@example.com");
    expect(res.body.employees[0].moderator).equal(false);
    expect(res.body.employees[0].name).equal("admin");
    expect(res.body.employees[0].phone).equal("+79123456789");
  });

  it("find all moderators", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: true,
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(1);
    expect(new Date(res.body.employees[0].registration)).be.a("Date");
    expect(res.body.employees[0].id).equal("2");
    expect(res.body.employees[0].admin).equal(false);
    expect(res.body.employees[0].banned).equal(false);
    expect(res.body.employees[0].email).equal("moderator@example.com");
    expect(res.body.employees[0].moderator).equal(true);
    expect(res.body.employees[0].name).equal("moderator");
    expect(res.body.employees[0].phone).equal("+79123456780");
  });

  it("find all not admins and not moderators", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        admin: false,
        moderator: false,
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(1);
    expect(new Date(res.body.employees[0].registration)).be.a("Date");
    expect(res.body.employees[0].id).equal("3");
    expect(res.body.employees[0].admin).equal(false);
    expect(res.body.employees[0].banned).equal(true);
    expect(res.body.employees[0].email).equal("employee@example.com");
    expect(res.body.employees[0].moderator).equal(false);
    expect(res.body.employees[0].name).equal("employee");
    expect(res.body.employees[0].phone).equal("+79123456781");
  });

  it("find all banned", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: true,
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(1);
    expect(new Date(res.body.employees[0].registration)).be.a("Date");
    expect(res.body.employees[0].id).equal("3");
    expect(res.body.employees[0].admin).equal(false);
    expect(res.body.employees[0].banned).equal(true);
    expect(res.body.employees[0].email).equal("employee@example.com");
    expect(res.body.employees[0].moderator).equal(false);
    expect(res.body.employees[0].name).equal("employee");
    expect(res.body.employees[0].phone).equal("+79123456781");
  });

  it("find all unbanned", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/employee/search`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: false,
      })
      .expect(200);

    expect(res.body).have.keys("employees");
    expect(res.body.employees).be.a("array");
    expect(res.body.employees).have.lengthOf(2);
    for (let i = 0; i < 2; ++i) {
      expect(res.body.employees[0]).have.keys(
        "admin", "banned", "email", "id", "moderator", "name", "phone", "registration");
      expect(new Date(res.body.employees[i].registration)).be.a("Date");
      expect(res.body.employees[i].id).equal(`${i + 1}`);
    }
    expect(res.body.employees[0].admin).equal(true);
    expect(res.body.employees[1].admin).equal(false);

    expect(res.body.employees[0].banned).equal(false);
    expect(res.body.employees[1].banned).equal(false);

    expect(res.body.employees[0].email).equal("admin@example.com");
    expect(res.body.employees[1].email).equal("moderator@example.com");

    expect(res.body.employees[0].moderator).equal(false);
    expect(res.body.employees[1].moderator).equal(true);

    expect(res.body.employees[0].name).equal("admin");
    expect(res.body.employees[1].name).equal("moderator");

    expect(res.body.employees[0].phone).equal("+79123456789");
    expect(res.body.employees[1].phone).equal("+79123456780");
  });
});
