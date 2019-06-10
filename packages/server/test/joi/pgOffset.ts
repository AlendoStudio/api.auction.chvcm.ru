import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi pgOffset", () => {
  describe("wrong", () => {
    it("value must be larger than or equal to 0", () => {
      const result = Joi.validate("-9223372036854775808", Joi.pgOffset());
      expect(result.error.message).equal(
        `"value" must be larger than or equal to 0`,
      );
    });

    it("value must be less than or equal to 9223372036854775807", () => {
      const result = Joi.validate("9223372036854775808", Joi.pgOffset());
      expect(result.error.message).equal(
        `"value" must be less than or equal to 9223372036854775807`,
      );
    });
  });

  describe("correct", () => {
    it("0 as number", () => {
      const result = Joi.validate(0, Joi.pgOffset());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("default", () => {
      const result = Joi.validate(undefined, Joi.pgOffset());
      expect(result.error).equal(null);
      expect(result.value).deep.equal("0");
    });

    it("max as string", () => {
      const result = Joi.validate("9223372036854775807", Joi.pgOffset());
      expect(result.error).equal(null);
      expect(result.value).equal("9223372036854775807");
    });
  });
});
