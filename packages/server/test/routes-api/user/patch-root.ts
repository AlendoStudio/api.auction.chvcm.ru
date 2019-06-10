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
  Employee,
  Env,
  TokenTfaOtp,
  TokenTfaRecovery,
  User,
  Web,
} from "../../../src";

describe("PATCH /user", () => {
  prepareApi();

  let tokenEmployee: string;
  let tokenEntity: string;
  beforeEach(async () => {
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await Employee.create({
      admin: true,
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
      tfa: false,
    });
    tokenEmployee = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(200)).body.token;

    tokenEntity = (await supertest(Web.instance.app)
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
      .expect(201)).body.token;

    await waitForExpect(() => {
      sinon.assert.calledTwice(spyMail);
    });
  });

  describe("No Content 204", () => {
    it("change email", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .send({
          email: "moderator@example.com",
        })
        .expect(204);

      const employee = (await User.findByPk("1")) as User;
      expect(employee.email).equal("moderator@example.com");

      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .send({
          email: "primer@hotmail.com",
        })
        .expect(204);

      const entity = (await User.findByPk("2")) as User;
      expect(entity.email).equal("primer@hotmail.com");
    });

    it("change language", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .send({
          language: "en",
        })
        .expect(204);

      const employee = (await User.findByPk("1")) as User;
      expect(employee.language).equal("en");

      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .send({
          language: "de",
        })
        .expect(204);

      const entity = (await User.findByPk("2")) as User;
      expect(entity.language).equal("de");
    });

    it("change name", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .send({
          name: "Mr. Admin",
        })
        .expect(204);

      const employee = (await User.findByPk("1")) as User;
      expect(employee.name).equal("Mr. Admin");

      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .send({
          name: `ООО "Экзампл"`,
        })
        .expect(204);

      const entity = (await User.findByPk("2")) as User;
      expect(entity.name).equal(`ООО "ПРИМЕР"`);
    });

    describe("change password", () => {
      it("ru email", async () => {
        await User.update(
          {
            language: "ru",
          },
          {
            where: {
              id: "2",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        await supertest(Web.instance.app)
          .patch(`${Const.API_MOUNT_POINT}/user`)
          .set("Authorization", `Bearer ${tokenEntity}`)
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
            "primer@yandex.ru",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains(
            `ООО "ПРИМЕР"`,
          );
          expect(spyMail.args[0][0].originalMessage.text).contains(
            `ООО "ПРИМЕР"`,
          );
        });

        await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "primer@yandex.ru",
            password: "super mario brazers",
          })
          .expect(200);
      });

      it("en email", async () => {
        await User.update(
          {
            language: "en",
          },
          {
            where: {
              id: "2",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        await supertest(Web.instance.app)
          .patch(`${Const.API_MOUNT_POINT}/user`)
          .set("Authorization", `Bearer ${tokenEntity}`)
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
            "primer@yandex.ru",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains(
            `ООО "ПРИМЕР"`,
          );
          expect(spyMail.args[0][0].originalMessage.text).contains(
            `ООО "ПРИМЕР"`,
          );
        });

        await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "primer@yandex.ru",
            password: "super mario brazers",
          })
          .expect(200);
      });
    });

    describe("change email, language, name and password", () => {
      it("ru email", async () => {
        await User.update(
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
          .patch(`${Const.API_MOUNT_POINT}/user`)
          .set("Authorization", `Bearer ${tokenEmployee}`)
          .send({
            email: "mario@example.com",
            language: "ru",
            name: "Mr. Admin",
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
            "mario@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("Mr. Admin");
          expect(spyMail.args[0][0].originalMessage.text).contains("Mr. Admin");
        });

        await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "mario@example.com",
            password: "super mario brazers",
          })
          .expect(200);

        const user = (await User.findByPk("1")) as User;
        expect(user.email).equal("mario@example.com");
        expect(user.language).equal("ru");
        expect(user.name).equal("Mr. Admin");
      });

      it("en email", async () => {
        await User.update(
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
          .patch(`${Const.API_MOUNT_POINT}/user`)
          .set("Authorization", `Bearer ${tokenEmployee}`)
          .send({
            email: "mario@example.com",
            language: "en",
            name: "Mr. Admin",
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
            "mario@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("Mr. Admin");
          expect(spyMail.args[0][0].originalMessage.text).contains("Mr. Admin");
        });

        await supertest(Web.instance.app)
          .post(`${Const.API_MOUNT_POINT}/signin`)
          .send({
            email: "mario@example.com",
            password: "super mario brazers",
          })
          .expect(200);

        const user = (await User.findByPk("1")) as User;
        expect(user.email).equal("mario@example.com");
        expect(user.language).equal("en");
        expect(user.name).equal("Mr. Admin");
      });
    });

    it("change phone", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .send({
          phone: "+79123456785",
        })
        .expect(204);

      const employee = (await User.findByPk("1")) as User;
      expect(employee.phone).equal("+79123456785");

      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/user`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .send({
          phone: "+79123456755",
        })
        .expect(204);

      const entity = (await User.findByPk("2")) as User;
      expect(entity.phone).equal("+79123456755");
    });

    describe("change tfa", () => {
      beforeEach(async () => {
        await TokenTfaOtp.create({
          token: "token",
          type: "authenticator",
          userId: "2",
        });
        await TokenTfaRecovery.bulkCreate([
          {
            token: "token 1",
            userId: "2",
          },
          {
            token: "token 2",
            userId: "2",
          },
        ]);
      });

      it("enable disabled", async () => {
        await User.update(
          {
            tfa: false,
          },
          {
            where: {
              id: "2",
            },
          },
        );

        await supertest(Web.instance.app)
          .patch(`${Const.API_MOUNT_POINT}/user`)
          .set("Authorization", `Bearer ${tokenEntity}`)
          .send({
            tfa: true,
          })
          .expect(204);

        const user = (await User.findByPk("2")) as User;
        expect(user.tfa).equal(true);

        expect(await TokenTfaOtp.count({where: {userId: "2"}})).equal(1);
        expect(
          await TokenTfaRecovery.count({
            where: {userId: "2"},
          }),
        ).equal(2);
      });

      it("disable enabled", async () => {
        await User.update(
          {
            tfa: true,
          },
          {
            where: {
              id: "2",
            },
          },
        );

        await supertest(Web.instance.app)
          .patch(`${Const.API_MOUNT_POINT}/user`)
          .set("Authorization", `Bearer ${tokenEntity}`)
          .send({
            tfa: false,
          })
          .expect(204);

        const user = await User.findByPk("2");
        expect((user as User).tfa).equal(false);

        expect(await TokenTfaOtp.count({where: {userId: "2"}})).equal(0);
        expect(
          await TokenTfaRecovery.count({
            where: {userId: "2"},
          }),
        ).equal(0);
      });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        email: "primer@",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" must be a valid email]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        language: "russian",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "language" fails because ["language" must be one of [aa, ab, ae, af, ak, am, an, ar, as, av, ay, az, ba, be, bg, bh, bi, bm, bn, bo, br, bs, ca, ce, ch, co, cr, cs, cu, cv, cy, da, de, dv, dz, ee, el, en, eo, es, et, eu, fa, ff, fi, fj, fo, fr, fy, ga, gd, gl, gn, gu, gv, ha, he, hi, ho, hr, ht, hu, hy, hz, ia, id, ie, ig, ii, ik, io, is, it, iu, ja, jv, ka, kg, ki, kj, kk, kl, km, kn, ko, kr, ks, ku, kv, kw, ky, la, lb, lg, li, ln, lo, lt, lu, lv, mg, mh, mi, mk, ml, mn, mr, ms, mt, my, na, nb, nd, ne, ng, nl, nn, no, nr, nv, ny, oc, oj, om, or, os, pa, pi, pl, ps, pt, qu, rm, rn, ro, ru, rw, sa, sc, sd, se, sg, si, sk, sl, sm, sn, so, sq, sr, ss, st, su, sv, sw, ta, te, tg, th, ti, tk, tl, tn, to, tr, ts, tt, tw, ty, ug, uk, ur, uz, ve, vi, vo, wa, wo, xh, yi, yo, za, zh, zu]]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        name: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "name" fails because ["name" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        password: "qwerty",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "password" fails because ["password" score must be larger than or equal to ${Const.MINIMUM_PASSWORD_SCORE}]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        phone: "89123456789",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "phone" fails because ["phone" must be in format +79xxxxxxxxx]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        tfa: "yes",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "tfa" fails because ["tfa" must be a boolean]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Conflict 409", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        email: "primer@yandex.ru",
        phone: "+79123456780",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_EMAIL_AND_PHONE,
        message: "user with same email and phone already exists",
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        email: "primer@yandex.ru",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_EMAIL,
        message: "user with same email already exists",
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/user`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        phone: "+79123456780",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_PHONE,
        message: "user with same phone already exists",
      });
  });
});
