import {reCaptchaMockAdapter} from "../../../common";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  IUserInstance,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../../src";

describe("GET /user/tfa/authenticator", () => {
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
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/authenticator`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/authenticator`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("correct", async () => {
    const res = await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/authenticator`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(res.body).to.have.keys("secret", "keyuri");
    expect(res.body.secret).to.be.a("string");
    expect(res.body.keyuri).to.be.a("string");
    const service = Const.AUTHENTICATOR_SERVICE;
    expect(res.body.keyuri).equal(`otpauth://totp/${service}:admin?secret=${res.body.secret}&issuer=${service}`);

    const user = await Sequelize.instance.employee.findById("1");
    expect((user as IUserInstance).authenticator).equal(res.body.secret);
  });
});
