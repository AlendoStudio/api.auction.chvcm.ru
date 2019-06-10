import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi itn-psrn", () => {
  describe("wrong itn", () => {
    it("value must be a number or a string", () => {
      const resultItn = Joi.validate(true, Joi.itn());
      expect(resultItn.error.message).equal(
        `"value" must be a number or a string`,
      );
    });

    it("value must be 10 digits", () => {
      const resultItn = Joi.validate(123456789, Joi.itn());
      expect(resultItn.error.message).equal(`"value" must be 10 digits`);
    });

    it("value must have correct checksum", () => {
      const resultItn = Joi.validate(1234567890, Joi.itn());
      expect(resultItn.error.message).equal(
        `"value" must have correct checksum`,
      );
    });
  });

  describe("wrong psrn", () => {
    it("value must be a number or a string", () => {
      const resultItn = Joi.validate(true, Joi.psrn());
      expect(resultItn.error.message).equal(
        `"value" must be a number or a string`,
      );
    });

    it("value must be 10 digits", () => {
      const resultItn = Joi.validate(123456789, Joi.psrn());
      expect(resultItn.error.message).equal(`"value" must be 13 digits`);
    });

    it("value must have correct checksum", () => {
      const resultItn = Joi.validate(1234567890123, Joi.psrn());
      expect(resultItn.error.message).equal(
        `"value" must have correct checksum`,
      );
    });
  });

  describe("correct foreign itn", () => {
    it(`ПРЕДСТАВИТЕЛЬСТВО КОМПАНИИ С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "АЙ ТИ ЭС СИ ЛИМИТЕД"`, () => {
      const resultItn = Joi.validate(9909068852, Joi.itn());
      expect(resultItn.error).equal(null);
      expect(resultItn.value).equal("9909068852");
    });

    it(`ПРЕДСТАВИТЕЛЬСТВО АКЦИОНЕРНОЙ КОМПАНИИ С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "ДАЛМОНД ТРЕЙД ХАУС ЛИМИТЕД"`, () => {
      const resultItn = Joi.validate("9909311360", Joi.itn());
      expect(resultItn.error).equal(null);
      expect(resultItn.value).equal("9909311360");
    });
  });

  describe("correct", () => {
    it(`ООО "УК "АРТВИС-МЕДИА"`, () => {
      const resultItn = Joi.validate(7627019317, Joi.itn());
      expect(resultItn.error).equal(null);
      expect(resultItn.value).equal("7627019317");

      const resultPsrn = Joi.validate(1027601593271, Joi.psrn());
      expect(resultPsrn.error).equal(null);
      expect(resultPsrn.value).equal("1027601593271");
    });

    it(`ООО АУДИТОРСКАЯ КОМПАНИЯ "АУДИТБИЗНЕСКОНСАЛТ"`, () => {
      const resultItn = Joi.validate("7704595727", Joi.itn());
      expect(resultItn.error).equal(null);
      expect(resultItn.value).equal("7704595727");

      const resultPsrn = Joi.validate("1067746504132", Joi.psrn());
      expect(resultPsrn.error).equal(null);
      expect(resultPsrn.value).equal("1067746504132");
    });

    it(`МБОУ "ГИМНАЗИЯ № 32"`, () => {
      const resultItn = Joi.validate("3729025520", Joi.itn());
      expect(resultItn.error).equal(null);
      expect(resultItn.value).equal("3729025520");

      const resultPsrn = Joi.validate("1033700070678", Joi.psrn());
      expect(resultPsrn.error).equal(null);
      expect(resultPsrn.value).equal("1033700070678");
    });

    it(`МБОУ "ГИМНАЗИЯ № 32"`, () => {
      const resultItn = Joi.validate("3729025520", Joi.itn());
      expect(resultItn.error).equal(null);
      expect(resultItn.value).equal("3729025520");

      const resultPsrn = Joi.validate("1033700070678", Joi.psrn());
      expect(resultPsrn.error).equal(null);
      expect(resultPsrn.value).equal("1033700070678");
    });

    it(`ООО "ГЛОРИОН"`, () => {
      const resultItn = Joi.validate(5405311042, Joi.itn());
      expect(resultItn.error).equal(null);
      expect(resultItn.value).equal("5405311042");

      const resultPsrn = Joi.validate(1065405024300, Joi.psrn());
      expect(resultPsrn.error).equal(null);
      expect(resultPsrn.value).equal("1065405024300");
    });
  });
});
