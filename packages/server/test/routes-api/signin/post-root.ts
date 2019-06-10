import {prepareApi} from "../../common";

import {expect} from "chai";
import * as moment from "moment";
import * as sinon from "sinon";
import * as supertest from "supertest";
import waitForExpect from "wait-for-expect";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  Employee,
  Env,
  Jwt,
  TokenTfaPurgatory,
  User,
  Web,
} from "../../../src";

describe("POST /signin", () => {
  prepareApi();

  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
    });
  });

  describe("Success 200", () => {
    describe("tfa disabled", () => {
      beforeEach(async () => {
        await Employee.update(
          {
            tfa: false,
          },
          {
            where: {
              id: 1,
            },
          },
        );
      });

      it("ru email", async () => {
        await Employee.update(
          {
            language: "ru",
          },
          {
            where: {
              id: "1",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        const res = await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "admin@example.com",
            password: "super mario",
          })
          .expect(200);

        await waitForExpect(() => {
          sinon.assert.calledOnce(spyMail);
          expect(spyMail.args[0][0].originalMessage.subject).equal(
            "Был выполнен вход в систему!",
          );
          expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
          expect(spyMail.args[0][0].originalMessage.to).equal(
            "admin@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("admin");
          expect(spyMail.args[0][0].originalMessage.text).contains("admin");
        });

        expect(res.body).to.have.keys("token", "tfa");
        expect(res.body.token).be.a("string");
        expect(res.body.tfa).equal(false);

        const parsedToken = await Jwt.verifyUser(res.body.token);
        expect(parsedToken).to.have.keys("id", "type");
        expect(parsedToken.id).equal("1");
        expect(parsedToken.type).equal(Const.USER_TYPE_EMPLOYEE);
      });

      it("en email", async () => {
        await Employee.update(
          {
            language: "en",
          },
          {
            where: {
              id: "1",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        const res = await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "admin@example.com",
            password: "super mario",
          })
          .expect(200);

        await waitForExpect(() => {
          sinon.assert.calledOnce(spyMail);
          expect(spyMail.args[0][0].originalMessage.subject).equal(
            "You're logged in!",
          );
          expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
          expect(spyMail.args[0][0].originalMessage.to).equal(
            "admin@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("admin");
          expect(spyMail.args[0][0].originalMessage.text).contains("admin");
        });

        expect(res.body).to.have.keys("token", "tfa");
        expect(res.body.token).be.a("string");
        expect(res.body.tfa).equal(false);

        const parsedToken = await Jwt.verifyUser(res.body.token);
        expect(parsedToken).to.have.keys("id", "type");
        expect(parsedToken.id).equal("1");
        expect(parsedToken.type).equal(Const.USER_TYPE_EMPLOYEE);
      });
    });

    describe("tfa enabled", () => {
      beforeEach(async () => {
        await Employee.update(
          {
            tfa: true,
          },
          {
            where: {
              id: 1,
            },
          },
        );
      });

      it("ru email", async () => {
        await Employee.update(
          {
            language: "ru",
          },
          {
            where: {
              id: "1",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        const res = await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "ADMIN@EXAMPLE.COM",
            password: "super mario",
          })
          .expect(200);

        await waitForExpect(() => {
          sinon.assert.calledOnce(spyMail);
          expect(spyMail.args[0][0].originalMessage.subject).equal(
            "Попытка входа в систему!",
          );
          expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
          expect(spyMail.args[0][0].originalMessage.to).equal(
            "admin@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("admin");
          expect(spyMail.args[0][0].originalMessage.text).contains("admin");
        });

        expect(res.body).to.have.keys("token", "tfa", "expires");
        expect(res.body.token).be.a("string");
        expect(moment(res.body.expires).isSameOrAfter(moment())).equal(true);
        expect(
          moment(res.body.expires).isSameOrBefore(
            moment().add(Const.TOKENS_TFA_PURGATORY_EXPIRESIN),
          ),
        ).equal(true);
        expect(res.body.tfa).equal(true);

        const tokens = await TokenTfaPurgatory.findAll();
        expect(tokens.length).equal(1);
        expect(tokens[0].token).equal(res.body.token);
        expect(tokens[0].userId).equal("1");
        expect((tokens[0].expires as Date).toISOString()).equal(
          res.body.expires,
        );
      });

      it("en email", async () => {
        await Employee.update(
          {
            language: "en",
          },
          {
            where: {
              id: "1",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        const res = await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "ADMIN@EXAMPLE.COM",
            password: "super mario",
          })
          .expect(200);

        await waitForExpect(() => {
          sinon.assert.calledOnce(spyMail);
          expect(spyMail.args[0][0].originalMessage.subject).equal(
            "Attempting to login!",
          );
          expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
          expect(spyMail.args[0][0].originalMessage.to).equal(
            "admin@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("admin");
          expect(spyMail.args[0][0].originalMessage.text).contains("admin");
        });

        expect(res.body).to.have.keys("token", "tfa", "expires");
        expect(res.body.token).be.a("string");
        expect(moment(res.body.expires).isSameOrAfter(moment())).equal(true);
        expect(
          moment(res.body.expires).isSameOrBefore(
            moment().add(Const.TOKENS_TFA_PURGATORY_EXPIRESIN),
          ),
        ).equal(true);
        expect(res.body.tfa).equal(true);

        const tokens = await TokenTfaPurgatory.findAll();
        expect(tokens.length).equal(1);
        expect(tokens[0].token).equal(res.body.token);
        expect(tokens[0].userId).equal("1");
        expect((tokens[0].expires as Date).toISOString()).equal(
          res.body.expires,
        );
      });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        password: "super mario",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@",
        password: "super mario",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" must be a valid email]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "qwerty",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" score must be larger than or equal to ${Const.MINIMUM_PASSWORD_SCORE}]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        ["g-recaptcha-response"]: "token",
        email: "admin@example.com",
        extraField: true,
        password: "super mario",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "mario@example.com",
        password: "super mario",
      })
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_EMAIL_AND_PASSWORD,
        message: "user with same email and password not found",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super admin",
      })
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_EMAIL_AND_PASSWORD,
        message: "user with same email and password not found",
      });

    await Employee.update(
      {
        banned: true,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });

    await User.update(
      {
        banned: false,
        password: null,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_EMAIL_AND_PASSWORD,
        message: "user with same email and password not found",
      });
  });
});
