import {prepareApi} from "../../common";

import {expect} from "chai";
import * as sinon from "sinon";
import * as supertest from "supertest";
import waitForExpect from "wait-for-expect";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  Entity,
  Env,
  Jwt,
  Web,
} from "../../../src";

describe("POST /entities", () => {
  prepareApi();

  describe("Created 201", () => {
    it("ru email", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

      const res = await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/entities`)
        .send({
          ceo: "Директор: Гордон Андрей Анатольевич",
          email: "primer@yandex.ru",
          itn: "3664069397",
          language: "ru",
          name: `ООО "ПРИМЕР"`,
          password: "super mario",
          phone: "+79123456780",
          psrn: "1053600591197",
        })
        .expect(201);

      await waitForExpect(() => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "Вы успешно зарегистрировались!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal("primer@yandex.ru");
        expect(spyMail.args[0][0].originalMessage.html).contains(
          `ООО "ПРИМЕР"`,
        );
        expect(spyMail.args[0][0].originalMessage.text).contains(
          `ООО "ПРИМЕР"`,
        );
      });

      expect(res.body).to.have.keys("token");
      expect(res.body.token).be.a("string");

      const parsedToken = await Jwt.verifyUser(res.body.token);
      expect(parsedToken).to.have.keys("id", "type");
      expect(parsedToken.id).equal("1");
      expect(parsedToken.type).equal("entity");

      const entity = (await Entity.findByPk("1")) as Entity;
      expect(entity.id).equal("1");
      expect(entity.name).equal(`ООО "ПРИМЕР"`);
      expect(entity.email).equal("primer@yandex.ru");
      expect(entity.phone).equal("+79123456780");
      expect(await Bcrypt.compare("super mario", entity.password)).equal(true);
      expect(entity.tfa).equal(false);
      expect(entity.language).equal("ru");
      expect(entity.banned).equal(false);
      expect(entity.ceo).equal("Директор: Гордон Андрей Анатольевич");
      expect(entity.psrn).equal("1053600591197");
      expect(entity.itn).equal("3664069397");
      expect(entity.verified).equal(false);
    });

    it("en email", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

      const res = await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/entities`)
        .send({
          ceo: "Директор: Гордон Андрей Анатольевич",
          email: "primer@yandex.ru",
          itn: "3664069397",
          language: "en",
          name: `ООО "ПРИМЕР"`,
          password: "super mario",
          phone: "+79123456780",
          psrn: "1053600591197",
        })
        .expect(201);

      await waitForExpect(() => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "You have successfully registered!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal("primer@yandex.ru");
        expect(spyMail.args[0][0].originalMessage.html).contains(
          `ООО "ПРИМЕР"`,
        );
        expect(spyMail.args[0][0].originalMessage.text).contains(
          `ООО "ПРИМЕР"`,
        );
      });

      expect(res.body).to.have.keys("token");
      expect(res.body.token).be.a("string");

      const parsedToken = await Jwt.verifyUser(res.body.token);
      expect(parsedToken).to.have.keys("id", "type");
      expect(parsedToken.id).equal("1");
      expect(parsedToken.type).equal("entity");

      const entity = (await Entity.findByPk("1")) as Entity;
      expect(entity.id).equal("1");
      expect(entity.name).equal(`ООО "ПРИМЕР"`);
      expect(entity.email).equal("primer@yandex.ru");
      expect(entity.phone).equal("+79123456780");
      expect(await Bcrypt.compare("super mario", entity.password)).equal(true);
      expect(entity.tfa).equal(false);
      expect(entity.language).equal("en");
      expect(entity.banned).equal(false);
      expect(entity.ceo).equal("Директор: Гордон Андрей Анатольевич");
      expect(entity.psrn).equal("1053600591197");
      expect(entity.itn).equal("3664069397");
      expect(entity.verified).equal(false);
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "ceo" fails because ["ceo" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "itn" fails because ["itn" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "language" fails because ["language" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "name" fails because ["name" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "phone" fails because ["phone" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "psrn" fails because ["psrn" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ["g-recaptcha-response"]: "token",
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        extraField: true,
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Conflict 409", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(201);

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_EMAIL_AND_PHONE,
        message: "user with same email and phone already exists",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@yandex.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456789",
        psrn: "1053600591197",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_EMAIL,
        message: "user with same email already exists",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@mail.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456780",
        psrn: "1053600591197",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_PHONE,
        message: "user with same phone already exists",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@mail.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456789",
        psrn: "1053600591197",
      })
      .expect(409, {
        code: ApiCodes.ENTITY_FOUND_BY_ITN_AND_PSRN,
        message: "entity with same itn and psrn already exists",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@mail.ru",
        itn: "3664069397",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456789",
        psrn: "1027601593271",
      })
      .expect(409, {
        code: ApiCodes.ENTITY_FOUND_BY_ITN,
        message: "entity with same itn already exists",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/entities`)
      .send({
        ceo: "Директор: Гордон Андрей Анатольевич",
        email: "primer@mail.ru",
        itn: "9909068852",
        language: "ru",
        name: `ООО "ПРИМЕР"`,
        password: "super mario",
        phone: "+79123456789",
        psrn: "1053600591197",
      })
      .expect(409, {
        code: ApiCodes.ENTITY_FOUND_BY_PSRN,
        message: "entity with same psrn already exists",
      });
  });
});
