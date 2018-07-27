import {reCaptchaMockAdapter} from "../../common";

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

describe("POST /lot/search", () => {
  let token: string;
  let finish: Date;
  let start: Date;
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
    start = new Date(Date.now() + 1_000);
    finish = new Date(start.getTime() + 1_000);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 3,
        amount_type: "piece",
        buffer: {
          hours: 1,
        },
        currency: "usd",
        finish,
        start,
        startbid: 1000.45,
        step: 100.25,
        stuffid: "1",
        type: "purchase",
      })
      .expect(200, {
        id: "1",
      });
  });

  it("find all", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot/search`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).have.keys("lots");
    expect(res.body.lots).be.a("Array");
    expect(res.body.lots[0]).have.keys("amount", "amount_type", "buffer", "currency", "finish",
      "id", "participants", "start", "startbid", "step", "stuffid", "type");
    expect(res.body.lots[0].amount).equal("3");
    expect(res.body.lots[0].amount_type).equal("piece");
    expect(res.body.lots[0].buffer).deep.equal({
      hours: 1,
    });
    expect(res.body.lots[0].currency).equal("usd");
    expect(new Date(res.body.lots[0].finish).getTime()).equal(finish.getTime());
    expect(res.body.lots[0].id).equal("1");
    expect(res.body.lots[0].participants).equal("0");
    expect(new Date(res.body.lots[0].start).getTime()).equal(start.getTime());
    expect(res.body.lots[0].startbid).equal("1000.45");
    expect(res.body.lots[0].step).equal("100.25");
    expect(res.body.lots[0].stuffid).equal("1");
    expect(res.body.lots[0].type).equal("purchase");
  });

  // TODO: add more tests
  // TODO: add 400 tests
});
