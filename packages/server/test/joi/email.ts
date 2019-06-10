import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi email", () => {
  describe("wrong", () => {
    it("value must be a valid email", () => {
      const result = Joi.validate("admin@", Joi.email());
      expect(result.error.message).equal(`"value" must be a valid email`);
    });
  });

  describe("correct", () => {
    it("lowercase email", () => {
      const result = Joi.validate("admin@example.com", Joi.email());
      expect(result.error).equal(null);
      expect(result.value).equal("admin@example.com");
    });

    it("uppercase email", () => {
      const result = Joi.validate("ADMIN@EXAMPLE.com", Joi.email());
      expect(result.error).equal(null);
      expect(result.value).equal("admin@example.com");
    });

    it("russian email", () => {
      const result = Joi.validate("безОтвета@держава.РУ", Joi.email());
      expect(result.error).equal(null);
      expect(result.value).equal("безответа@держава.ру");
    });
  });
});
