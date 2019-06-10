import {prepareApi} from "../../common";

import * as supertest from "supertest";

import {ApiCodes, Const, Web} from "../../../src";

describe("POST /utils/password/check", () => {
  prepareApi();

  it("Success 200", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/check`)
      .send({
        password: new Array(72).fill("a").join(""),
      })
      .expect(200, {
        score: {
          actual: 0,
          expected: Const.MINIMUM_PASSWORD_SCORE,
          max: 4,
          min: 0,
        },
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/check`)
      .send({
        password: "super mario",
      })
      .expect(200, {
        score: {
          actual: 3,
          expected: Const.MINIMUM_PASSWORD_SCORE,
          max: 4,
          min: 0,
        },
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/check`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/check`)
      .send({
        password: new Array(73).fill("a").join(""),
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" length must be less than or equal to 72 characters long]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/check`)
      .send({
        extraField: true,
        password: "qwerty",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });
});
