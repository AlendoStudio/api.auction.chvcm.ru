import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi pgInterval", () => {
  describe("wrong", () => {
    it("child must be a positive number", () => {
      const result = Joi.validate({days: -10}, Joi.pgInterval());
      expect(result.error.message).equal(
        `child "days" fails because ["days" must be a positive number]`,
      );
    });

    it("field is not allowed", () => {
      const result = Joi.validate({extra: 10}, Joi.pgInterval());
      expect(result.error.message).equal(`"extra" is not allowed`);
    });

    it("string", () => {
      const result = Joi.validate(
        "01:01:01",
        Joi.object().keys({buffer: Joi.pgInterval().required()}),
      );
      expect(result.error.message).equal(`"value" must be an object`);
    });

    it("undefined", () => {
      const result = Joi.validate(
        {},
        Joi.object().keys({buffer: Joi.pgInterval().required()}),
      );
      expect(result.error.message).equal(
        `child "buffer" fails because ["buffer" is required]`,
      );
    });
  });

  describe("correct", () => {
    it("empty object", () => {
      const result = Joi.validate({}, Joi.pgInterval());
      expect(result.error).equal(null);
      expect(result.value).equal("0");
    });

    it("object", () => {
      const result = Joi.validate({minutes: 10, seconds: 50}, Joi.pgInterval());
      expect(result.error).equal(null);
      expect(result.value).equal("50 seconds 10 minutes");
    });
  });
});
