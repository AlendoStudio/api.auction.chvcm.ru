import "../common";

import {expect} from "chai";

import {Joi} from "../../src";

describe("Joi pgEnumCurrency", () => {
  describe("wrong", () => {
    it("value must be a string", () => {
      const result = Joi.validate(100, Joi.pgEnumCurrency());
      expect(result.error.message).equal(`"value" must be a string`);
    });

    it("value  must be one of", () => {
      const result = Joi.validate("rus", Joi.pgEnumCurrency());
      expect(result.error.message).equal(
        `"value" must be one of [aed, afn, all, amd, ang, aoa, ars, aud, awg, azn, bam, bbd, bdt, bgn, bhd, bif, bmd, bnd, bob, bov, brl, bsd, btn, bwp, byn, bzd, cad, cdf, che, chf, chw, clf, clp, cny, cop, cou, crc, cuc, cup, cve, czk, djf, dkk, dop, dzd, egp, ern, etb, eur, fjd, fkp, gbp, gel, ghs, gip, gmd, gnf, gtq, gyd, hkd, hnl, hrk, htg, huf, idr, ils, inr, iqd, irr, isk, jmd, jod, jpy, kes, kgs, khr, kmf, kpw, krw, kwd, kyd, kzt, lak, lbp, lkr, lrd, lsl, lyd, mad, mdl, mga, mkd, mmk, mnt, mop, mru, mur, mvr, mwk, mxn, mxv, myr, mzn, nad, ngn, nio, nok, npr, nzd, omr, pab, pen, pgk, php, pkr, pln, pyg, qar, ron, rsd, rub, rwf, sar, sbd, scr, sdg, sek, sgd, shp, sll, sos, srd, ssp, stn, svc, syp, szl, thb, tjs, tmt, tnd, top, try, ttd, twd, tzs, uah, ugx, usd, usn, uyi, uyu, uyw, uzs, ves, vnd, vuv, wst, xaf, xag, xau, xba, xbb, xbc, xbd, xcd, xdr, xof, xpd, xpf, xpt, xsu, xts, xua, xxx, yer, zar, zmw, zwl]`,
      );
    });
  });

  describe("correct", () => {
    it("rub", () => {
      const result = Joi.validate("rub", Joi.pgEnumCurrency());
      expect(result.error).equal(null);
      expect(result.value).equal("rub");
    });

    it("usd", () => {
      const result = Joi.validate("usd", Joi.pgEnumCurrency());
      expect(result.error).equal(null);
      expect(result.value).equal("usd");
    });
  });
});
