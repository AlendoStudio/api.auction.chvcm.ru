import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi phone", () => {
  describe("wrong", () => {
    it("russian mobile phone with lead 8", () => {
      const result = Joi.validate("89697131443", Joi.phone());
      expect(result.error.message).equal(
        `"value" must be in format +79xxxxxxxxx`,
      );
    });
  });

  describe("correct", () => {
    it("russian mobile phone", () => {
      const result = Joi.validate("+79697131443", Joi.phone());
      expect(result.error).equal(null);
      expect(result.value).equal("+79697131443");
    });
  });
});
