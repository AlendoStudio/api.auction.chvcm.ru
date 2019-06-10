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
  TokenPasswordReset,
  Web,
} from "../../../src";

describe("GET /utils/password/reset", () => {
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
        .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
        .query({
          email: "admin@example.com",
        })
        .expect(200);

      expect(res.body).to.have.keys("expires");
      expect(moment(res.body.expires).isSameOrAfter(moment())).equal(true);
      expect(
        moment(res.body.expires).isSameOrBefore(
          moment().add(Const.TOKENS_PASSWORD_RESET_EXPIRESIN),
        ),
      ).equal(true);

      const tokens = await TokenPasswordReset.findAll();
      expect(tokens.length).equal(1);
      expect(tokens[0].userId).equal("1");
      expect((tokens[0].expires as Date).toISOString()).equal(res.body.expires);

      await waitForExpect(async () => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "Сброс пароля!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal(
          "admin@example.com",
        );
        expect(spyMail.args[0][0].originalMessage.html).contains("admin");
        expect(spyMail.args[0][0].originalMessage.html).contains(tokens[0]
          .token as string);
        expect(spyMail.args[0][0].originalMessage.text).contains("admin");
        expect(spyMail.args[0][0].originalMessage.text).contains(tokens[0]
          .token as string);
      });
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
        .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
        .query({
          email: "admin@example.com",
        })
        .expect(200);

      expect(res.body).to.have.keys("expires");
      expect(moment(res.body.expires).isSameOrAfter(moment())).equal(true);
      expect(
        moment(res.body.expires).isSameOrBefore(
          moment().add(Const.TOKENS_PASSWORD_RESET_EXPIRESIN),
        ),
      ).equal(true);

      const tokens = await TokenPasswordReset.findAll();
      expect(tokens.length).equal(1);
      expect(tokens[0].userId).equal("1");
      expect((tokens[0].expires as Date).toISOString()).equal(res.body.expires);

      await waitForExpect(async () => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "Password reset!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal(
          "admin@example.com",
        );
        expect(spyMail.args[0][0].originalMessage.html).contains("admin");
        expect(spyMail.args[0][0].originalMessage.html).contains(tokens[0]
          .token as string);
        expect(spyMail.args[0][0].originalMessage.text).contains("admin");
        expect(spyMail.args[0][0].originalMessage.text).contains(tokens[0]
          .token as string);
      });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" is required]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .query({
        email: "admin@",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" must be a valid email]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .query({
        ["g-recaptcha-response"]: "token",
        email: "admin@example.com",
        extraField: true,
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .query({
        email: "mario@example.com",
      })
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_EMAIL,
        message: "user with same email not found",
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
      .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .query({
        email: "admin@example.com",
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });
});
