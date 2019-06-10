import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi attachmentName", () => {
  describe("wrong", () => {
    it("start with space", () => {
      const result = Joi.validate(" files.zip", Joi.attachmentName());
      expect(result.error.message).equal(
        `"value" with value " files.zip" fails to match the required pattern: /^[a-zA-Zа-яА-Я0-9_\\-]([a-zA-Zа-яА-Я0-9_\\- ]*(\\.\\w+)?)*\\.\\w+$/`,
      );
    });

    it("without extension", () => {
      const result = Joi.validate("files", Joi.attachmentName());
      expect(result.error.message).equal(
        `"value" with value "files" fails to match the required pattern: /^[a-zA-Zа-яА-Я0-9_\\-]([a-zA-Zа-яА-Я0-9_\\- ]*(\\.\\w+)?)*\\.\\w+$/`,
      );
    });

    it("with bad symbols", () => {
      const result = Joi.validate("/files.zip", Joi.attachmentName());
      expect(result.error.message).equal(
        `"value" with value "/files.zip" fails to match the required pattern: /^[a-zA-Zа-яА-Я0-9_\\-]([a-zA-Zа-яА-Я0-9_\\- ]*(\\.\\w+)?)*\\.\\w+$/`,
      );
    });

    it("value is not allowed to be empty", () => {
      const result = Joi.validate("", Joi.attachmentName());
      expect(result.error.message).equal(`"value" is not allowed to be empty`);
    });
  });

  describe("correct", () => {
    it("en file name with extension", () => {
      const result = Joi.validate("files.zip", Joi.attachmentName());
      expect(result.error).equal(null);
      expect(result.value).equal("files.zip");
    });

    it("ru file name with space and extension", () => {
      const result = Joi.validate(
        "Устав предприятия.pdf",
        Joi.attachmentName(),
      );
      expect(result.error).equal(null);
      expect(result.value).equal("Устав предприятия.pdf");
    });

    it("ru file name with and double extension", () => {
      const result = Joi.validate(
        "Лицензия-на_деятельность.tar.gz",
        Joi.attachmentName(),
      );
      expect(result.error).equal(null);
      expect(result.value).equal("Лицензия-на_деятельность.tar.gz");
    });

    it("number file name with extension", () => {
      const result = Joi.validate("777.7z", Joi.attachmentName());
      expect(result.error).equal(null);
      expect(result.value).equal("777.7z");
    });
  });
});
