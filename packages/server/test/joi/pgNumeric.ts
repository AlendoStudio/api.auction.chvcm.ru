import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi pgNumeric", () => {
  describe("wrong", () => {
    it("value must be a number or a string", () => {
      const result = Joi.validate(true, Joi.pgNumeric());
      expect(result.error.message).equal(
        `"value" must be a number or a string`,
      );
    });

    it("value must up to 131072 digits...", () => {
      const result = Joi.validate("  \t  ", Joi.pgNumeric());
      expect(result.error.message).equal(
        `"value" must up to 131072 digits before the decimal point; up to 16383 digits after the decimal point`,
      );
    });
  });

  describe("correct", () => {
    it("0 as number", () => {
      const result = Joi.validate(0, Joi.pgNumeric());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("0 as string", () => {
      const result = Joi.validate("0", Joi.pgNumeric());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("2.25 as number", () => {
      const result = Joi.validate(2.25, Joi.pgNumeric());
      expect(result.error).equal(null);
      expect(result.value).equal("2.25");
    });

    it("-2.25 as string", () => {
      const result = Joi.validate("-2.25", Joi.pgNumeric());
      expect(result.error).equal(null);
      expect(result.value).equal("-2.25");
    });
  });

  describe("positive", () => {
    it("value must be a positive for number", () => {
      const result = Joi.validate(-2.25, Joi.pgNumeric().positive());
      expect(result.error.message).equal(`"value" must be a positive`);
    });

    it("value must be a positive for string", () => {
      const result = Joi.validate("-2.25", Joi.pgNumeric().positive());
      expect(result.error.message).equal(`"value" must be a positive`);
    });

    it("0 as number", () => {
      const result = Joi.validate(0, Joi.pgNumeric().positive());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("0 as string", () => {
      const result = Joi.validate("0", Joi.pgNumeric().positive());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("2.25 as number", () => {
      const result = Joi.validate(2.25, Joi.pgNumeric().positive());
      expect(result.error).equal(null);
      expect(result.value).equal("2.25");
    });

    it("2.25 as string", () => {
      const result = Joi.validate("2.25", Joi.pgNumeric().positive());
      expect(result.error).equal(null);
      expect(result.value).equal("2.25");
    });
  });
});
