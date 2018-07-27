import {reCaptchaMockAdapter} from "../../common";

import {PgIntervalUnitCodes} from "@alendo/express-req-validator";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import {IPostgresInterval} from "postgres-interval";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  ILotInstance,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("POST /lot", () => {
  let token: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
      email: "admin@example.com",
      language: "ru",
      moderator: true,
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200, {
        id: "1",
      });
  });

  // TODO: add 400 tests

  it("interval overflow", async () => {
    const start = new Date(Date.now() + 1_000);
    const finish = new Date(start.getTime() + 1_000);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 2.25,
        amount_type: "kg",
        buffer: {
          years: 179000000,
        },
        currency: "rub",
        finish,
        start,
        startbid: 1000,
        step: 100,
        stuffid: "1",
        type: "sale",
      })
      .expect(400, {
        code: PgIntervalUnitCodes.WRONG_PG_INTERVAL,
        message: "body.buffer: interval out of range",
      });
  });

  it("required moderator", async () => {
    await Sequelize.instance.employee.update({
      moderator: false,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot`)
      .set("Authorization", `Bearer ${token}`)
      .expect(401, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("correct", async () => {
    const start = new Date(Date.now() + 1_000);
    const finish = new Date(start.getTime() + 1_000);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 2.25,
        amount_type: "kg",
        buffer: {
          minutes: 1,
        },
        currency: "rub",
        finish,
        start,
        startbid: 1000,
        step: 100,
        stuffid: "1",
        type: "sale",
      })
      .expect(200, {
        id: "1",
      });

    const lot = await Sequelize.instance.lot.findById("1") as ILotInstance;
    expect(lot.id).equal("1");
    expect(lot.stuffid).equal("1");
    expect(lot.type).equal("sale");
    expect(lot.amount).equal("2.25");
    expect(lot.amount_type).equal("kg");
    expect((lot.start as Date).getTime()).equal(start.getTime());
    expect((lot.finish as Date).getTime()).equal(finish.getTime());
    expect((lot.buffer as IPostgresInterval).toPostgres()).equal("1 minutes");
    expect(lot.startbid).equal("1000");
    expect(lot.step).equal("100");
    expect(lot.currency).equal("rub");
    expect(lot.participants).equal("0");
    expect(lot.winbid).equal(null);
    expect(lot.winner).equal(null);
  });
});
