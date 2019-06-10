import {prepareApi} from "../../../common";

import {expect} from "chai";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Employee,
  TokenTfaOtp,
  Web,
} from "../../../../src";

describe("PUT /user/tfa/otp", () => {
  prepareApi();

  let token: string;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      name: `Админ "Великий"`,
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

  describe("No Content 204", () => {
    it("default", async () => {
      const res = await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).to.have.keys("secret", "keyuri");
      expect(res.body.secret).to.be.a("string");
      expect(res.body.keyuri).to.be.a("string");
      const service = encodeURIComponent(Const.AUTHENTICATOR_SERVICE);
      const name = encodeURIComponent(`Админ "Великий"`);
      expect(res.body.keyuri).equal(
        `otpauth://totp/${service}:${name}?secret=${res.body.secret}&issuer=${service}`,
      );

      const tokenOtp = (await TokenTfaOtp.findByPk("1")) as TokenTfaOtp;
      expect(tokenOtp.token).equal(res.body.secret);
      expect(tokenOtp.type).equal("authenticator");
    });

    it("authenticator", async () => {
      const res = await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          type: "authenticator",
        })
        .expect(200);

      expect(res.body).to.have.keys("secret", "keyuri");
      expect(res.body.secret).to.be.a("string");
      expect(res.body.keyuri).to.be.a("string");
      const service = encodeURIComponent(Const.AUTHENTICATOR_SERVICE);
      const name = encodeURIComponent(`Админ "Великий"`);
      expect(res.body.keyuri).equal(
        `otpauth://totp/${service}:${name}?secret=${res.body.secret}&issuer=${service}`,
      );

      const tokenOtp = (await TokenTfaOtp.findByPk("1")) as TokenTfaOtp;
      expect(tokenOtp.token).equal(res.body.secret);
      expect(tokenOtp.type).equal("authenticator");
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "type" fails because ["type" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        type: "google",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "type" fails because ["type" must be one of [authenticator]]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });
});
