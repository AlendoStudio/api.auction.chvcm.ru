import {prepareApi} from "../../../common";

import * as otplib from "otplib";
import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Web} from "../../../../src";

describe("POST /user/tfa/otp", () => {
  prepareApi();

  let token: string;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
      tfa: false,
    });

    token = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(200)).body.token;
  });

  describe("Success 200", () => {
    it("not found", async () => {
      await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          token: otplib.authenticator.generate(
            otplib.authenticator.generateSecret(),
          ),
        })
        .expect(200, {
          result: false,
        });
    });

    describe("authenticator", () => {
      let secret: string;
      beforeEach(async () => {
        secret = (await supertest(Web.instance.app)
          .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            type: "authenticator",
          })
          .expect(200)).body.secret;
      });

      it("result false", async () => {
        await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            token: otplib.authenticator.generate(
              otplib.authenticator.generateSecret(),
            ),
          })
          .expect(200, {
            result: false,
          });
      });

      it("result true", async () => {
        await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            token: otplib.authenticator.generate(secret),
          })
          .expect(200, {
            result: true,
          });
      });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "token" fails because ["token" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .send({})
      .set("Authorization", `Bearer ${token}`)
      .send({
        token: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "token" fails because ["token" is not allowed to be empty]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });
});
