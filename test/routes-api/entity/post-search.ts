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

describe("POST /entity/search", () => {
  let token: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
      admin: true,
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
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signup`)
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
      .expect(200);
  });

  it("find all", async () => {
    const res = await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/entity/search`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).have.keys("entities");
    expect(res.body.entities).be.a("Array");
    expect(res.body.entities[0]).have.keys("banned", "ceo", "email", "id", "itn", "name", "phone", "psrn",
      "registration", "verified");
    expect(res.body.entities[0].banned).equal(false);
    expect(res.body.entities[0].ceo).equal("Catherine Havasi");
    expect(res.body.entities[0].email).equal("entity@example.com");
    expect(res.body.entities[0].id).equal("2");
    expect(res.body.entities[0].itn).equal(Number(76_27_01931_7).toString());
    expect(res.body.entities[0].name).equal("Luminoso");
    expect(res.body.entities[0].phone).equal("+16176829056");
    expect(res.body.entities[0].psrn).equal(Number(1_02_76_01_59327_1).toString());
    expect(new Date(res.body.entities[0].registration)).be.a("Date");
    expect(res.body.entities[0].verified).equal(false);
  });

  // TODO: add more tests
  // TODO: add 400 and null tests
});
