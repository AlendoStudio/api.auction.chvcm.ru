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
  Web,
} from "../../../src";

describe("POST /employees", () => {
  prepareApi();

  let token: string;
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
    });

    token = (await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super mario",
      })
      .expect(200)).body.token;

    await waitForExpect(() => {
      sinon.assert.calledOnce(spyMail);
    });
  });

  describe("Created 201", () => {
    it("ru email", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

      await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/employees`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "moderator@example.com",
          language: "ru",
          name: "moderator",
          phone: "+79123456780",
        })
        .expect(201, {
          id: "2",
        });

      await waitForExpect(() => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "Добро пожаловать в семью сотрудников!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal(
          "moderator@example.com",
        );
        expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
        expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
      });

      const employee = (await Employee.findByPk("2")) as Employee;
      expect(employee.id).equal("2");
      expect(employee.name).equal("moderator");
      expect(employee.email).equal("moderator@example.com");
      expect(employee.phone).equal("+79123456780");
      expect(employee.password).equal(null);
      expect(employee.tfa).equal(false);
      expect(employee.language).equal("ru");
      expect(employee.banned).equal(false);
      expect(employee.registration).to.be.a("Date");
      expect(employee.admin).equal(false);
      expect(employee.moderator).equal(false);
    });

    it("en email", async () => {
      const spyMail = sinon.stub();
      EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

      await supertest(Web.instance.app)
        .post(`${Const.API_MOUNT_POINT}/employees`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          email: "moderator@example.com",
          language: "en",
          name: "moderator",
          phone: "+79123456780",
        })
        .expect(201, {
          id: "2",
        });

      await waitForExpect(() => {
        sinon.assert.calledOnce(spyMail);
        expect(spyMail.args[0][0].originalMessage.subject).equal(
          "Welcome to the family of employees!",
        );
        expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
        expect(spyMail.args[0][0].originalMessage.to).equal(
          "moderator@example.com",
        );
        expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
        expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
      });

      const employee = (await Employee.findByPk("2")) as Employee;
      expect(employee.id).equal("2");
      expect(employee.name).equal("moderator");
      expect(employee.email).equal("moderator@example.com");
      expect(employee.phone).equal("+79123456780");
      expect(employee.password).equal(null);
      expect(employee.tfa).equal(false);
      expect(employee.language).equal("en");
      expect(employee.banned).equal(false);
      expect(employee.registration).to.be.a("Date");
      expect(employee.admin).equal(false);
      expect(employee.moderator).equal(false);
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "language" fails because ["language" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "name" fails because ["name" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "moderator",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "phone" fails because ["phone" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@",
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "email" fails because ["email" must be a valid email]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "russian",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "language" fails because ["language" must be one of [aa, ab, ae, af, ak, am, an, ar, as, av, ay, az, ba, be, bg, bh, bi, bm, bn, bo, br, bs, ca, ce, ch, co, cr, cs, cu, cv, cy, da, de, dv, dz, ee, el, en, eo, es, et, eu, fa, ff, fi, fj, fo, fr, fy, ga, gd, gl, gn, gu, gv, ha, he, hi, ho, hr, ht, hu, hy, hz, ia, id, ie, ig, ii, ik, io, is, it, iu, ja, jv, ka, kg, ki, kj, kk, kl, km, kn, ko, kr, ks, ku, kv, kw, ky, la, lb, lg, li, ln, lo, lt, lu, lv, mg, mh, mi, mk, ml, mn, mr, ms, mt, my, na, nb, nd, ne, ng, nl, nn, no, nr, nv, ny, oc, oj, om, or, os, pa, pi, pl, ps, pt, qu, rm, rn, ro, ru, rw, sa, sc, sd, se, sg, si, sk, sl, sm, sn, so, sq, sr, ss, st, su, sv, sw, ta, te, tg, th, ti, tk, tl, tn, to, tr, ts, tt, tw, ty, ug, uk, ur, uz, ve, vi, vo, wa, wo, xh, yi, yo, za, zh, zu]]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "name" fails because ["name" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "moderator",
        phone: "89123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "phone" fails because ["phone" must be in format +79xxxxxxxxx]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        extraField: true,
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await Employee.update(
      {
        admin: false,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_ADMIN,
        message: "required admin",
      });
  });

  it("Conflict 409", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456789",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_EMAIL_AND_PHONE,
        message: "user with same email and phone already exists",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "admin@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_EMAIL,
        message: "user with same email already exists",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456789",
      })
      .expect(409, {
        code: ApiCodes.USER_FOUND_BY_PHONE,
        message: "user with same phone already exists",
      });
  });
});
