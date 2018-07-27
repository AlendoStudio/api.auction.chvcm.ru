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

describe("POST /lot/bet/:id", () => {
  let tokenModerator: string;
  let tokenEntity: string;
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
    tokenModerator = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/stuff`)
      .set("Authorization", `Bearer ${tokenModerator}`)
      .expect(200, {
        id: "1",
      });
    start = new Date(Date.now() + 1_000);
    finish = new Date(start.getTime() + 1_000);
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot`)
      .set("Authorization", `Bearer ${tokenModerator}`)
      .send({
        amount: 3,
        amount_type: "piece",
        buffer: {
          hours: 1,
        },
        currency: "usd",
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
    tokenEntity = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signup`)
      .send({
        ceo: "Catherine Havasi",
        email: "entity@example.com",
        itn: 76_27_01931_7,
        language: "en",
        name: "Luminoso",
        password: "super duper password",
        phone: "+16176829056",
        psrn: 1_02_76_01_59327_1,
      })
      .expect(200)).body.token;
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/2`)
      .set("Authorization", `Bearer ${tokenModerator}`)
      .send({
        verified: true,
      })
      .expect(204);
  });

  it("bet (sale)", async () => {
    await Sequelize.instance.lot.update({
      finish: new Date(Date.now() + 1_000),
      start: new Date(Date.now() - 1_000),
    }, {
      where: {
        id: "1",
      },
    });
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/lot/bet/1`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        bid: 1100,
      })
      .expect(200);
    expect(res.body).have.keys("finish", "participants", "winbid", "winner");
    expect(new Date(res.body.finish)).be.a("Date");
    expect(res.body.participants).equal("1");
    expect(res.body.winbid).equal("1100");
    expect(res.body.winner).equal("2");
  });

  // TODO: add more tests
  // TODO: add 400 tests
});
