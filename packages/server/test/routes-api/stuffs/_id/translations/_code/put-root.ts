import {prepareApi} from "../../../../../common";

import {expect} from "chai";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Employee,
  StuffTranslation,
  Web,
} from "../../../../../../src";

describe("PUT /stuffs/:id/translations/:code", () => {
  prepareApi();

  let token: string;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      moderator: true,
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

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "kg",
      })
      .expect(201, {
        id: "1",
      });
  });

  describe("No Content 204", () => {
    it("without description", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Gold",
        })
        .expect(204);

      const tr = (await StuffTranslation.findOne({
        where: {
          code: "en",
          stuffId: "1",
        },
      })) as StuffTranslation;

      expect(tr.title).equal("Gold");
      expect(tr.description).equal("");
    });

    it("with empty description", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "",
          title: "Gold",
        })
        .expect(204);

      const tr = (await StuffTranslation.findOne({
        where: {
          code: "en",
          stuffId: "1",
        },
      })) as StuffTranslation;

      expect(tr.title).equal("Gold");
      expect(tr.description).equal("");
    });

    it("with description", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "Golden Gold",
          title: "Gold",
        })
        .expect(204);

      const tr = (await StuffTranslation.findOne({
        where: {
          code: "en",
          stuffId: "1",
        },
      })) as StuffTranslation;

      expect(tr.title).equal("Gold");
      expect(tr.description).equal("Golden Gold");
    });

    it("override", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "Golden Gold",
          title: "Gold",
        })
        .expect(204);

      const tr1 = (await StuffTranslation.findOne({
        where: {
          code: "en",
          stuffId: "1",
        },
      })) as StuffTranslation;

      expect(tr1.title).equal("Gold");
      expect(tr1.description).equal("Golden Gold");

      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          description: "Golden Gold 2",
          title: "Gold 2",
        })
        .expect(204);

      const tr2 = (await StuffTranslation.findOne({
        where: {
          code: "en",
          stuffId: "1",
        },
      })) as StuffTranslation;

      expect(tr2.title).equal("Gold 2");
      expect(tr2.description).equal("Golden Gold 2");
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/aaa/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/russian`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "code" fails because ["code" must be one of [aa, ab, ae, af, ak, am, an, ar, as, av, ay, az, ba, be, bg, bh, bi, bm, bn, bo, br, bs, ca, ce, ch, co, cr, cs, cu, cv, cy, da, de, dv, dz, ee, el, en, eo, es, et, eu, fa, ff, fi, fj, fo, fr, fy, ga, gd, gl, gn, gu, gv, ha, he, hi, ho, hr, ht, hu, hy, hz, ia, id, ie, ig, ii, ik, io, is, it, iu, ja, jv, ka, kg, ki, kj, kk, kl, km, kn, ko, kr, ks, ku, kv, kw, ky, la, lb, lg, li, ln, lo, lt, lu, lv, mg, mh, mi, mk, ml, mn, mr, ms, mt, my, na, nb, nd, ne, ng, nl, nn, no, nr, nv, ny, oc, oj, om, or, os, pa, pi, pl, ps, pt, qu, rm, rn, ro, ru, rw, sa, sc, sd, se, sg, si, sk, sl, sm, sn, so, sq, sr, ss, st, su, sv, sw, ta, te, tg, th, ti, tk, tl, tn, to, tr, ts, tt, tw, ty, ug, uk, ur, uz, ve, vi, vo, wa, wo, xh, yi, yo, za, zh, zu]]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: true,
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "description" fails because ["description" must be a string]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "title" fails because ["title" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        extraField: true,
        title: "Gold",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await Employee.update(
      {
        moderator: false,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/999/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        code: ApiCodes.STUFF_NOT_FOUND_BY_ID,
        message: "stuff with same id not found",
      });
  });
});
