import "../common";

import {expect} from "chai";

import {Const, Joi} from "../../src";

describe("Joi zxcvbn", () => {
  describe("wrong", () => {
    it("value length must be less than or equal to 72 characters long", () => {
      const result = Joi.validate(
        new Array(73).fill("a").join(""),
        Joi.zxcvbn(),
      );
      expect(result.error.message).equal(
        `"value" length must be less than or equal to 72 characters long`,
      );
    });

    it("score must be larger than or equal to", () => {
      const result = Joi.validate("qwerty", Joi.zxcvbn());
      expect(result.error.message).equal(
        `"value" score must be larger than or equal to ${Const.MINIMUM_PASSWORD_SCORE}`,
      );
    });
  });

  describe("correct", () => {
    it("super duper password", () => {
      const result = Joi.validate("super duper password", Joi.zxcvbn());
      expect(result.error).equal(null);
      expect(result.value).equal("super duper password");
    });
  });
});
