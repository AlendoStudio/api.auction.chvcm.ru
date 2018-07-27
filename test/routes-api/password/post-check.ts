import "../../common";

import {NotEmptyStringUnitCodes, ObjectUnitCodes} from "@alendo/express-req-validator";

import {beforeEach, describe, it} from "mocha";
import * as supertest from "supertest";

import {Const, Web} from "../../../src";

describe("POST /password/check", () => {
  it("wrong password", async () => {
    await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/password/check`)
      .send({
        password: "",
      })
      .expect(400, {
        code: NotEmptyStringUnitCodes.WRONG_NOT_EMPTY_STRING,
        message: "body.password: value must be not empty string",
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
