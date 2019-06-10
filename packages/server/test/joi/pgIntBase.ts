import "../common";

import {expect} from "chai";

import pgIntBase from "../../src/joi/pgIntBase";

describe("Joi pgIntBase", () => {
  describe("wrong", () => {
    it("value must be a number or a string", () => {
      const result = pgIntBase.validate(true, pgIntBase.pgIntBase());
      expect(result.error.message).equal(
        `"value" must be a number or a string`,
      );
    });

    it("value must be an integer for number", () => {
      const result = pgIntBase.validate(2.25, pgIntBase.pgIntBase());
      expect(result.error.message).equal(`"value" must be an integer`);
    });

    it("value must be an integer for string", () => {
      const result = pgIntBase.validate("2.25", pgIntBase.pgIntBase());
      expect(result.error.message).equal(`"value" must be an integer`);
    });

    it("value must be an integer for alpha string", () => {
      const result = pgIntBase.validate("aaabbb", pgIntBase.pgIntBase());
      expect(result.error.message).equal(`"value" must be an integer`);
    });

    it("value must be an integer for empty string", () => {
      const result = pgIntBase.validate("", pgIntBase.pgIntBase());
      expect(result.error.message).equal(`"value" must be an integer`);
    });

    it("value must be an integer for whitespace string", () => {
      const result = pgIntBase.validate("  \t  ", pgIntBase.pgIntBase());
      expect(result.error.message).equal(`"value" must be an integer`);
    });
  });

  describe("correct", () => {
    it("123 as number", () => {
      const result = pgIntBase.validate(123, pgIntBase.pgIntBase());
      expect(result.error).equal(null);
      expect(result.value).equal("123");
    });

    it("123 as string", () => {
      const result = pgIntBase.validate("123", pgIntBase.pgIntBase());
      expect(result.error).equal(null);
      expect(result.value).equal("123");
    });

    it("-123 as number", () => {
      const result = pgIntBase.validate(-123, pgIntBase.pgIntBase());
      expect(result.error).equal(null);
      expect(result.value).equal("-123");
    });

    it("-123 as string", () => {
      const result = pgIntBase.validate("-123", pgIntBase.pgIntBase());
      expect(result.error).equal(null);
      expect(result.value).equal("-123");
    });

    it("0 as number", () => {
      const result = pgIntBase.validate(0, pgIntBase.pgIntBase());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("0 as string", () => {
      const result = pgIntBase.validate("0", pgIntBase.pgIntBase());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });
  });

  describe("min", () => {
    it("value must be larger than or equal to for number", () => {
      const result = pgIntBase.validate(99, pgIntBase.pgIntBase().min(100n));
      expect(result.error.message).equal(
        `"value" must be larger than or equal to 100`,
      );
    });

    it("value must be larger than or equal to for string", () => {
      const result = pgIntBase.validate("99", pgIntBase.pgIntBase().min(100n));
      expect(result.error.message).equal(
        `"value" must be larger than or equal to 100`,
      );
    });

    it("equal for number", () => {
      const result = pgIntBase.validate(100, pgIntBase.pgIntBase().min(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("100");
    });

    it("equal for string", () => {
      const result = pgIntBase.validate("100", pgIntBase.pgIntBase().min(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("100");
    });

    it("more for number", () => {
      const result = pgIntBase.validate(150, pgIntBase.pgIntBase().min(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("150");
    });

    it("more for string", () => {
      const result = pgIntBase.validate("150", pgIntBase.pgIntBase().min(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("150");
    });
  });

  describe("max", () => {
    it("value must be less than or equal to for number", () => {
      const result = pgIntBase.validate(101, pgIntBase.pgIntBase().max(100n));
      expect(result.error.message).equal(
        `"value" must be less than or equal to 100`,
      );
    });

    it("value must be less than or equal to for string", () => {
      const result = pgIntBase.validate("101", pgIntBase.pgIntBase().max(100n));
      expect(result.error.message).equal(
        `"value" must be less than or equal to 100`,
      );
    });

    it("equal for number", () => {
      const result = pgIntBase.validate(100, pgIntBase.pgIntBase().max(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("100");
    });

    it("equal for string", () => {
      const result = pgIntBase.validate("100", pgIntBase.pgIntBase().max(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("100");
    });

    it("less for number", () => {
      const result = pgIntBase.validate(50, pgIntBase.pgIntBase().max(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("50");
    });

    it("less for string", () => {
      const result = pgIntBase.validate("50", pgIntBase.pgIntBase().max(100n));
      expect(result.error).equal(null);
      expect(result.value).equal("50");
    });
  });
});
