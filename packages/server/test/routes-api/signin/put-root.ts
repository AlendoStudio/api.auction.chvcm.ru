import {prepareApi} from "../../common";

import {expect} from "chai";
import * as cuid from "cuid";
import * as otplib from "otplib";
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
  TokenTfaOtp,
  TokenTfaPurgatory,
  TokenTfaRecovery,
  User,
  Web,
} from "../../../src";

describe("PUT /signin", () => {
  prepareApi();

  let authToken: string;
  let purgatoryToken: string;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
      tfa: false,
    });

    authToken = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(200)).body.token;

    await User.update(
      {
        tfa: true,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    purgatoryToken = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(200)).body.token;
  });

  describe("otp", () => {
    describe("authenticator", () => {
      let secret: string;
      beforeEach(async () => {
        secret = (await supertest(Web.instance.app)
          .put(`${Const.API_MOUNT_POINT}/user/tfa/otp`)
          .set("Authorization", `Bearer ${authToken}`)
          .send({
            type: "authenticator",
          })
          .expect(200)).body.secret;
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
          EmailNotifications.instance.on(
            EmailNotifications.EMAIL_EVENT,
            spyMail,
          );

          const res = await supertest(Web.instance.app)
            .put(`${Const.API_MOUNT_POINT}/signin`)
            .set("Authorization", `Bearer ${purgatoryToken}`)
            .send({
              token: otplib.authenticator.generate(secret),
              type: "otp",
            })
            .expect(200);

          expect(res.body).to.have.keys("token", "tfa");
          expect(res.body.token).be.a("string");
          expect(res.body.tfa).equal(true);

          const parsedToken = await Jwt.verifyUser(res.body.token);
          expect(parsedToken).to.have.keys("id", "type");
          expect(parsedToken.id).equal("1");
          expect(parsedToken.type).equal(Const.USER_TYPE_EMPLOYEE);

          await waitForExpect(() => {
            sinon.assert.calledOnce(spyMail);
            expect(spyMail.args[0][0].originalMessage.subject).equal(
              "Был выполнен вход в систему!",
            );
            expect(spyMail.args[0][0].originalMessage.from).equal(
              Env.EMAIL_FROM,
            );
            expect(spyMail.args[0][0].originalMessage.to).equal(
              "admin@example.com",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains("admin");
            expect(spyMail.args[0][0].originalMessage.text).contains("admin");
          });

          const purgatoryTokenCount = await TokenTfaPurgatory.count({
            where: {
              token: purgatoryToken,
            },
          });
          expect(purgatoryTokenCount).equal(0);
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
          EmailNotifications.instance.on(
            EmailNotifications.EMAIL_EVENT,
            spyMail,
          );

          const res = await supertest(Web.instance.app)
            .put(`${Const.API_MOUNT_POINT}/signin`)
            .set("Authorization", `Bearer ${purgatoryToken}`)
            .send({
              token: otplib.authenticator.generate(secret),
              type: "otp",
            })
            .expect(200);

          expect(res.body).to.have.keys("token", "tfa");
          expect(res.body.token).be.a("string");
          expect(res.body.tfa).equal(true);

          const parsedToken = await Jwt.verifyUser(res.body.token);
          expect(parsedToken).to.have.keys("id", "type");
          expect(parsedToken.id).equal("1");
          expect(parsedToken.type).equal("employee");

          await waitForExpect(() => {
            sinon.assert.calledOnce(spyMail);
            expect(spyMail.args[0][0].originalMessage.subject).equal(
              "You're logged in!",
            );
            expect(spyMail.args[0][0].originalMessage.from).equal(
              Env.EMAIL_FROM,
            );
            expect(spyMail.args[0][0].originalMessage.to).equal(
              "admin@example.com",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains("admin");
            expect(spyMail.args[0][0].originalMessage.text).contains("admin");
          });

          const purgatoryTokenCount = await TokenTfaPurgatory.count({
            where: {
              token: purgatoryToken,
            },
          });
          expect(purgatoryTokenCount).equal(0);
        });
      });

      it("Unauthorized 401", async () => {
        await supertest(Web.instance.app)
          .put(`${Const.API_MOUNT_POINT}/signin`)
          .set("Authorization", `Bearer ${purgatoryToken}`)
          .send({
            token: otplib.authenticator.generate(
              otplib.authenticator.generateSecret(),
            ),
            type: "otp",
          })
          .expect(401, {
            code: ApiCodes.WRONG_OTP_TOKEN,
            message: "wrong otp token",
          });

        await TokenTfaOtp.destroy({
          where: {
            userId: "1",
          },
        });

        await supertest(Web.instance.app)
          .put(`${Const.API_MOUNT_POINT}/signin`)
          .set("Authorization", `Bearer ${purgatoryToken}`)
          .send({
            token: otplib.authenticator.generate(
              otplib.authenticator.generateSecret(),
            ),
            type: "otp",
          })
          .expect(401, {
            code: ApiCodes.WRONG_OTP_TOKEN,
            message: "wrong otp token",
          });
      });
    });
  });

  describe("recovery", () => {
    let recoveryTokens: string[];
    let recoveryCode: string;
    beforeEach(async () => {
      recoveryTokens = (await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/user/tfa/recovery`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200)).body.tokens;
      recoveryCode = recoveryTokens[0];
      recoveryTokens = recoveryTokens.slice(1);
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
          .put(`${Const.API_MOUNT_POINT}/signin`)
          .set("Authorization", `Bearer ${purgatoryToken}`)
          .send({
            token: recoveryCode,
            type: "recovery",
          })
          .expect(200);

        expect(res.body).to.have.keys("token", "tfa");
        expect(res.body.token).be.a("string");
        expect(res.body.tfa).equal(true);

        const parsedToken = await Jwt.verifyUser(res.body.token);
        expect(parsedToken).to.have.keys("id", "type");
        expect(parsedToken.id).equal("1");
        expect(parsedToken.type).equal(Const.USER_TYPE_EMPLOYEE);

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

        const purgatoryTokenCount = await TokenTfaPurgatory.count({
          where: {
            token: purgatoryToken,
          },
        });
        expect(purgatoryTokenCount).equal(0);

        const lefTokens = await TokenTfaRecovery.findAll({
          where: {
            userId: "1",
          },
        });
        expect(lefTokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT - 1);
        expect(recoveryTokens).to.be.deep.equal(
          lefTokens.map((item) => item.token),
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
          .put(`${Const.API_MOUNT_POINT}/signin`)
          .set("Authorization", `Bearer ${purgatoryToken}`)
          .send({
            token: recoveryCode,
            type: "recovery",
          })
          .expect(200);

        expect(res.body).to.have.keys("token", "tfa");
        expect(res.body.token).be.a("string");
        expect(res.body.tfa).equal(true);

        const parsedToken = await Jwt.verifyUser(res.body.token);
        expect(parsedToken).to.have.keys("id", "type");
        expect(parsedToken.id).equal("1");
        expect(parsedToken.type).equal(Const.USER_TYPE_EMPLOYEE);

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

        const purgatoryTokenCount = await TokenTfaPurgatory.count({
          where: {
            token: purgatoryToken,
          },
        });
        expect(purgatoryTokenCount).equal(0);

        const lefTokens = await TokenTfaRecovery.findAll({
          where: {
            userId: "1",
          },
        });
        expect(lefTokens).have.lengthOf(Const.TFA_RECOVERY_CODES_COUNT - 1);
        expect(recoveryTokens).to.be.deep.equal(
          lefTokens.map((item) => item.token),
        );
      });
    });

    it("Unauthorized 401", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/signin`)
        .set("Authorization", `Bearer ${purgatoryToken}`)
        .send({
          token: cuid(),
          type: "recovery",
        })
        .expect(401, {
          code: ApiCodes.RECOVERY_CODE_NOT_FOUND,
          message: "recovery code not found",
        });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        type: "otp",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "token" fails because ["token" is required]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: cuid(),
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "type" fails because ["type" is required]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: true,
        type: "otp",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "token" fails because ["token" must be a string]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: cuid(),
        type: "pto",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "type" fails because ["type" must be one of [otp, recovery]]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        extraField: true,
        token: cuid(),
        type: "otp",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
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
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .send({
        token: cuid(),
        type: "recovery",
      })
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_PURGATORY_TOKEN,
        message: "user not found by purgatory token",
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${cuid()}`)
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_PURGATORY_TOKEN,
        message: "user not found by purgatory token",
      });

    await TokenTfaPurgatory.update(
      {
        expires: new Date(),
      },
      {
        where: {
          token: purgatoryToken,
        },
      },
    );
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/signin`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .expect(401, {
        code: ApiCodes.USER_NOT_FOUND_BY_PURGATORY_TOKEN,
        message: "user not found by purgatory token",
      });
  });
});
