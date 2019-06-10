import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi pgEnumAmountType", () => {
  describe("wrong", () => {
    it("value must be a string", () => {
      const result = Joi.validate(100, Joi.pgEnumAmountType());
      expect(result.error.message).equal(`"value" must be a string`);
    });

    it("value  must be one of", () => {
      const result = Joi.validate("tn", Joi.pgEnumAmountType());
      expect(result.error.message).equal(`"value" must be one of [kg, piece]`);
    });
  });

  describe("correct", () => {
    it("kg", () => {
      const result = Joi.validate("kg", Joi.pgEnumAmountType());
      expect(result.error).equal(null);
      expect(result.value).equal("kg");
    });

    it("piece", () => {
      const result = Joi.validate("piece", Joi.pgEnumAmountType());
      expect(result.error).equal(null);
      expect(result.value).equal("piece");
    });
  });
});
