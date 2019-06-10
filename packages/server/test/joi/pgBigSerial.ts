import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi pgBigSerial", () => {
  describe("wrong", () => {
    it("value must be larger than or equal to 1", () => {
      const result = Joi.validate("-9223372036854775808", Joi.pgBigSerial());
      expect(result.error.message).equal(
        `"value" must be larger than or equal to 1`,
      );
    });

    it("value must be less than or equal to 9223372036854775807", () => {
      const result = Joi.validate("9223372036854775808", Joi.pgBigSerial());
      expect(result.error.message).equal(
        `"value" must be less than or equal to 9223372036854775807`,
      );
    });
  });

  describe("correct", () => {
    it("1 as number", () => {
      const result = Joi.validate(1, Joi.pgBigSerial());
      expect(result.error).equal(null);
      expect(result.value).equal("1");
    });

    it("100 as string", () => {
      const result = Joi.validate("100", Joi.pgBigSerial());
      expect(result.error).equal(null);
      expect(result.value).equal("100");
    });

    it("9223372036854775807 as string", () => {
      const result = Joi.validate("9223372036854775807", Joi.pgBigSerial());
      expect(result.error).equal(null);
      expect(result.value).equal("9223372036854775807");
    });
  });
});
