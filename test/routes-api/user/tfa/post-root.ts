import {reCaptchaMockAdapter} from "../../../common";

import {BooleanUnitCodes, ObjectUnitCodes} from "@alendo/express-req-validator";

import {expect} from "chai";
import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  IUserInstance,
  Jwt,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../../src";

describe("POST /user/tfa", () => {
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

  it("missing tfa", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.tfa: missing value",
      });
  });

  it("null tfa", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tfa: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: "body.tfa: value can't be null",
      });
  });

  it("wrong tfa", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tfa: "true",
      })
      .expect(400, {
        code: BooleanUnitCodes.WRONG_BOOLEAN,
        message: "body.tfa: value must be boolean",
      });
  });

  it("401 Unauthorized - verify user (jwt must be provided)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .send({
        tfa: true,
      })
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });
  });

  it("401 Unauthorized - verify user (jwt malformed)", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer token`)
      .send({
        tfa: true,
      })
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("401 Unauthorized - DB_EMPLOYEE_NOT_FOUND_BY_ID", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${await Jwt.signUser({
        id: "2",
        type: "employee",
      })}`)
      .send({
        tfa: true,
      })
      .expect(401, {
        code: ApiCodes.DB_EMPLOYEE_NOT_FOUND_BY_ID,
        message: "employee with same id not found",
      });
  });

  it("user was banned", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tfa: true,
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });

  it("enable disabled tfa", async () => {
    await Sequelize.instance.user.update({
      tfa: false,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tfa: true,
      })
      .expect(204);
    const user = await Sequelize.instance.user.findById("1");
    expect((user as IUserInstance).tfa).equal(true);
  });

  it("enable enabled tfa", async () => {
    await Sequelize.instance.user.update({
      tfa: true,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tfa: true,
      })
      .expect(204);
    const user = await
      Sequelize.instance.user.findById("1");
    expect((user as IUserInstance).tfa).equal(true);
  });

  it("disable enabled tfa", async () => {
    await Sequelize.instance.user.update({
      tfa: true,
    }, {
      where: {
        id: "1",
      },
    });

    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/authenticator`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    const recoveryCodesCountBefore = await Sequelize.instance.tokensTfaRecovery.count({
      where: {
        userid: "1",
      },
    });
    expect(recoveryCodesCountBefore).equal(Const.TFA_RECOVERY_CODES_COUNT);

    const userBefore = await Sequelize.instance.user.findById("1");
    expect((userBefore as IUserInstance).tfa).equal(true);
    expect((userBefore as IUserInstance).authenticator).not.equal(null);

    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tfa: false,
      })
      .expect(204);

    const userAfter = await Sequelize.instance.user.findById("1");
    expect((userAfter as IUserInstance).tfa).equal(false);
    expect((userAfter as IUserInstance).authenticator).equal(null);

    const recoveryCodesCountAfter = await Sequelize.instance.tokensTfaRecovery.count({
      where: {
        userid: "1",
      },
    });
    expect(recoveryCodesCountAfter).equal(0);
  });

  it("disable disable tfa", async () => {
    await Sequelize.instance.user.update({
      tfa: false,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/user/tfa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        tfa: false,
      })
      .expect(204);
    const user = await Sequelize.instance.user.findById("1");
    expect((user as IUserInstance).tfa).equal(false);
  });
});
