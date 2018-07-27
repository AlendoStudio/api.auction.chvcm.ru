import {reCaptchaMockAdapter} from "../../../common";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../../src";

describe("GET /user/tfa/recovery", () => {
  let token: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
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
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("correct token", async () => {
    const res = await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).to.have.keys("tokens");
    expect(res.body.tokens).to.be.a("array");
    expect(res.body.tokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);

    const tokens = await Sequelize.instance.tokensTfaRecovery.findAll({
      where: {
        userid: "1",
      },
    });
    expect(tokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);
    expect(res.body.tokens).to.be.deep.equal(tokens.map((item) => item.token));
  });

  it("correct token with duplicates", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    const res = await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).to.have.keys("tokens");
    expect(res.body.tokens).to.be.a("array");
    expect(res.body.tokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);

    const tokens = await Sequelize.instance.tokensTfaRecovery.findAll({
      where: {
        userid: "1",
      },
    });
    expect(tokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);
    expect(res.body.tokens).to.be.deep.equal(tokens.map((item) => item.token));
  });
});
