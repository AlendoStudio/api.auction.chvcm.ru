import {prepareApi} from "../../../common";

import {expect} from "chai";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Employee,
  TokenTfaRecovery,
  Web,
} from "../../../../src";

describe("PUT /user/tfa/recovery", () => {
  prepareApi();

  let token: string;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super duper password"),
      phone: "+79123456789",
      tfa: false,
    });
    token = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
  });

  it("Success 200", async () => {
    const resFirst = await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(resFirst.body).to.have.keys("tokens");
    expect(resFirst.body.tokens).to.be.a("array");
    expect(resFirst.body.tokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);

    const tokensFirst = await TokenTfaRecovery.findAll({
      where: {
        userId: "1",
      },
    });
    expect(tokensFirst).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);
    expect(resFirst.body.tokens).to.be.deep.equal(
      tokensFirst.map((item) => item.token),
    );

    const resSecond = await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
    expect(resSecond.body).to.have.keys("tokens");
    expect(resSecond.body.tokens).to.be.a("array");
    expect(resSecond.body.tokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);

    const tokensSecond = await TokenTfaRecovery.findAll({
      where: {
        userId: "1",
      },
    });
    expect(tokensSecond).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT);
    expect(resSecond.body.tokens).to.be.deep.equal(
      tokensSecond.map((item) => item.token),
    );
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });
});
