import {prepareApi} from "../../common";

import {expect} from "chai";
import * as cuid from "cuid";
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

describe("POST /utils/password/reset", () => {
  prepareApi();

  let passwordResetToken: string;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
    });

    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .query({
        email: "admin@example.com",
      })
      .expect(200);

    await waitForExpect(() => {
      sinon.assert.calledOnce(spyMail);
    });

    passwordResetToken = ((await TokenPasswordReset.findOne({
      where: {
        userId: "1",
      },
    })) as TokenPasswordReset).token as string;
  });

  describe("No Content 204", () => {
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

      await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
        .set("Authorization", `Bearer ${passwordResetToken}`)
        .send({
          password: "super mario brazers",
        })
        .expect(204);

      await waitForExpect(() => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "Пароль был сброшен!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal(
          "admin@example.com",
        );
        expect(spyMail.args[0][0].originalMessage.html).contains("admin");
        expect(spyMail.args[0][0].originalMessage.text).contains("admin");
      });

      await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super mario brazers",
        })
        .expect(200);

      const tokensPasswordResetCount = await TokenPasswordReset.count({
        where: {
          userId: "1",
        },
      });
      expect(tokensPasswordResetCount).equal(0);
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

      await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
        .set("Authorization", `Bearer ${passwordResetToken}`)
        .send({
          password: "super mario brazers",
        })
        .expect(204);

      await waitForExpect(() => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "Password has been reset!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal(
          "admin@example.com",
        );
        expect(spyMail.args[0][0].originalMessage.html).contains("admin");
        expect(spyMail.args[0][0].originalMessage.text).contains("admin");
      });

      await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/signin`)
        .send({
          email: "admin@example.com",
          password: "super mario brazers",
        })
        .expect(200);

      const tokensPasswordResetCount = await TokenPasswordReset.count({
        where: {
          userId: "1",
        },
      });
      expect(tokensPasswordResetCount).equal(0);
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: new Array(73).fill("a").join(""),
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" length must be less than or equal to 72 characters long]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "qwerty",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" score must be larger than or equal to ${Const.MINIMUM_PASSWORD_SCORE}]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        extraField: true,
        password: "super mario brazers",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .send({
        password: "super mario brazers",
      })
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN,
        message: "user not found by password reset token",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .set("Authorization", `Bearer ${cuid()}`)
      .send({
        password: "super mario brazers",
      })
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN,
        message: "user not found by password reset token",
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
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "super mario brazers",
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });

    await TokenPasswordReset.update(
      {
        expires: new Date(),
      },
      {
        where: {
          token: passwordResetToken,
        },
      },
    );
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/password/reset`)
      .set("Authorization", `Bearer ${passwordResetToken}`)
      .send({
        password: "super mario brazers",
      })
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN,
        message: "user not found by password reset token",
      });
  });
});
