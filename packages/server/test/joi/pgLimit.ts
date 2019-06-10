import "../common";

import {expect} from "chai";

import {Const, Joi} from "../../src";

describe("Joi pgLimit", () => {
  describe("wrong", () => {
    it("value must be larger than or equal to 0", () => {
      const result = Joi.validate("-9223372036854775808", Joi.pgLimit());
      expect(result.error.message).equal(
        `"value" must be larger than or equal to 0`,
      );
    });

    it("value must be less than or equal to", () => {
      const result = Joi.validate("9223372036854775808", Joi.pgLimit());
      expect(result.error.message).equal(
        `"value" must be less than or equal to ${Const.LIMIT_LIMIT}`,
      );
    });
  });

  describe("correct", () => {
    it("0 as number", () => {
      const result = Joi.validate(0, Joi.pgLimit());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("50 as string", () => {
      const result = Joi.validate("50", Joi.pgLimit());
      expect(result.error).equal(null);
      expect(result.value).equal("50");
    });

    it("default", () => {
      const result = Joi.validate(undefined, Joi.pgLimit());
      expect(result.error).equal(null);
      expect(result.value).deep.equal(Const.LIMIT_LIMIT);
    });

    it("max as string", () => {
      const result = Joi.validate(Const.LIMIT_LIMIT, Joi.pgLimit());
      expect(result.error).equal(null);
      expect(result.value).equal(Const.LIMIT_LIMIT);
    });
  });
});
