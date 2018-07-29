import "../../common";

import {ObjectUnitCodes, StringUnitCodes} from "@alendo/express-req-validator";

import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {ApiCodes, Const, Web} from "../../../src";

describe("POST /password/check", () => {
  it("too large password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: new Array(1_000_000).fill("a").join(""),
      })
      .expect(413, {
        code: ApiCodes.PAYLOAD_TOO_LARGE_ERROR,
        message: "payload too large error",
      });
  });

  it("wrong password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: 12345,
      })
      .expect(400, {
        code: StringUnitCodes.WRONG_STRING,
        message: "body.password: value must be string",
      });
  });

  it("empty password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: "",
      })
      .expect(400, {
        code: StringUnitCodes.WRONG_STRING_LENGTH_RANGE,
        message: "body.password: string length must be in range [1, 72]",
      });
  });

  it("null password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: null,
      })
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_NULL_VALUE,
        message: `body.password: value can't be null`,
      });
  });

  it("missing password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({})
      .expect(400, {
        code: ObjectUnitCodes.OBJECT_MISSING_KEY,
        message: "body.password: missing value",
      });
  });

  it("big password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: new Array(73).fill("a").join(""),
      })
      .expect(400, {
        code: StringUnitCodes.WRONG_STRING_LENGTH_RANGE,
        message: "body.password: string length must be in range [1, 72]",
      })
      .timeout(2000);
  });

  it("ideal for length password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
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
      })
      .timeout(2000);
  });

  it("correct - tiny password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: "qwerty",
      })
      .expect(200, {
        score: {
          actual: 0,
          expected: Const.MINIMUM_PASSWORD_SCORE,
          max: 4,
          min: 0,
        },
      });
  });

  it("correct - strong password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: "super duper password",
      })
      .expect(200, {
        score: {
          actual: 4,
          expected: Const.MINIMUM_PASSWORD_SCORE,
          max: 4,
          min: 0,
        },
      });
  });
});
