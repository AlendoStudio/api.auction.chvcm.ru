import {prepareApi} from "../../common";

import {expect} from "chai";
import * as moment from "moment";
import {IPostgresInterval} from "postgres-interval";
import * as sinon from "sinon";
import * as io from "socket.io-client";
import * as supertest from "supertest";
import waitForExpect from "wait-for-expect";

import {ApiCodes, Bcrypt, Const, Employee, Env, Lot, Web} from "../../../src";

describe("POST /lots", () => {
  prepareApi.beforeEach();

  let token: string;
  let socket: SocketIOClient.Socket;
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

    socket = io(`http://localhost:${Env.PORT}${Const.API_MOUNT_POINT}`, {
      query: {
        token,
      },
      transports: Const.SOCKET_TRANSPORTS,
    });
  });

  afterEach(() => {
    socket.disconnect();
  });

  prepareApi.afterEach();

  it("Created 201", async () => {
    const start = moment()
      .add({minute: 10})
      .toDate();
    const finish = moment(start)
      .add({minute: 10})
      .toDate();

    const spySocket = sinon.stub();
    socket.on("lot", spySocket);

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(201, {
        id: "1",
      });

    await waitForExpect(() => {
      sinon.assert.calledOnce(spySocket);
      expect(spySocket.args[0][0]).have.keys(
        "amount",
        "buffer",
        "currency",
        "finish",
        "id",
        "participants",
        "start",
        "startBid",
        "step",
        "strict",
        "stuffId",
        "type",
        "winnerBid",
        "winnerId",
      );
      expect(spySocket.args[0][0].amount).equal("2.25");
      expect(spySocket.args[0][0].buffer).deep.equal({minutes: 10});
      expect(spySocket.args[0][0].currency).equal("rub");
      expect(moment(spySocket.args[0][0].finish).isSame(finish)).equal(true);
      expect(spySocket.args[0][0].id).equal("1");
      expect(spySocket.args[0][0].participants).equal("0");
      expect(moment(spySocket.args[0][0].start).isSame(start)).equal(true);
      expect(spySocket.args[0][0].startBid).equal("1000");
      expect(spySocket.args[0][0].step).equal("100");
      expect(spySocket.args[0][0].strict).equal(false);
      expect(spySocket.args[0][0].stuffId).equal("1");
      expect(spySocket.args[0][0].type).equal("sale");
      expect(spySocket.args[0][0].winnerBid).equal(null);
      expect(spySocket.args[0][0].winnerId).equal(null);
    });

    const lot = (await Lot.findByPk("1")) as Lot;
    expect(lot.id).equal("1");
    expect(lot.stuffId).equal("1");
    expect(lot.type).equal("sale");
    expect(lot.amount).equal("2.25");
    expect((lot.start as Date).toISOString()).equal(start.toISOString());
    expect((lot.finish as Date).toISOString()).equal(finish.toISOString());
    expect((lot.buffer as IPostgresInterval).toPostgres()).equal("10 minutes");
    expect(lot.startBid).equal("1000");
    expect(lot.step).equal("100");
    expect(lot.strict).equal(false);
    expect(lot.currency).equal("rub");
    expect(lot.participants).equal("0");
    expect(lot.winnerBid).equal(null);
    expect(lot.winnerId).equal(null);
  });

  it("Bad Request 400", async () => {
    const start = moment()
      .add({minute: 10})
      .toDate();
    const finish = moment(start)
      .add({minute: 10})
      .toDate();

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "amount" fails because ["amount" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "buffer" fails because ["buffer" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "currency" fails because ["currency" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "finish" fails because ["finish" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "start" fails because ["start" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "startBid" fails because ["startBid" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "step" fails because ["step" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "strict" fails because ["strict" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "stuffId" fails because ["stuffId" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "type" fails because ["type" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "0",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "amount" fails because ["amount" contains an invalid value]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "-5",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "amount" fails because ["amount" must be a positive]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          extraField: true,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "buffer" fails because ["extraField" is not allowed]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "russian ruble",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "currency" fails because ["currency" must be one of [aed, afn, all, amd, ang, aoa, ars, aud, awg, azn, bam, bbd, bdt, bgn, bhd, bif, bmd, bnd, bob, bov, brl, bsd, btn, bwp, byn, bzd, cad, cdf, che, chf, chw, clf, clp, cny, cop, cou, crc, cuc, cup, cve, czk, djf, dkk, dop, dzd, egp, ern, etb, eur, fjd, fkp, gbp, gel, ghs, gip, gmd, gnf, gtq, gyd, hkd, hnl, hrk, htg, huf, idr, ils, inr, iqd, irr, isk, jmd, jod, jpy, kes, kgs, khr, kmf, kpw, krw, kwd, kyd, kzt, lak, lbp, lkr, lrd, lsl, lyd, mad, mdl, mga, mkd, mmk, mnt, mop, mru, mur, mvr, mwk, mxn, mxv, myr, mzn, nad, ngn, nio, nok, npr, nzd, omr, pab, pen, pgk, php, pkr, pln, pyg, qar, ron, rsd, rub, rwf, sar, sbd, scr, sdg, sek, sgd, shp, sll, sos, srd, ssp, stn, svc, syp, szl, thb, tjs, tmt, tnd, top, try, ttd, twd, tzs, uah, ugx, usd, usn, uyi, uyu, uyw, uzs, ves, vnd, vuv, wst, xaf, xag, xau, xba, xbb, xbc, xbd, xcd, xdr, xof, xpd, xpf, xpt, xsu, xts, xua, xxx, yer, zar, zmw, zwl]]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish: finish.toLocaleDateString(),
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "finish" fails because ["finish" must be a valid ISO 8601 date]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start: start.toLocaleDateString(),
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "start" fails because ["start" must be a valid ISO 8601 date]`,
      });

    const finishLessThanStart = moment(start)
      .subtract({minute: 15})
      .toDate();
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish: finishLessThanStart,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "start" fails because ["start" must be less than "${finishLessThanStart}"]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "-1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "startBid" fails because ["startBid" must be a positive]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "-100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "step" fails because ["step" must be a positive]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: "no",
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "strict" fails because ["strict" must be a boolean]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "0",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "stuffId" fails because ["stuffId" must be larger than or equal to 1]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "garage sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "type" fails because ["type" must be one of [purchase, sale]]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        extraField: true,
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          years: 179_000_000,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "buffer" fails because ["buffer" out of range]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
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
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("Not Found 404", async () => {
    const start = moment()
      .add({minute: 10})
      .toDate();
    const finish = moment(start)
      .add({minute: 10})
      .toDate();

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: "2.25",
        buffer: {
          minutes: 10,
        },
        currency: "rub",
        finish,
        start,
        startBid: "1000",
        step: "100",
        strict: false,
        stuffId: "999",
        type: "sale",
      })
      .expect(404, {
        code: ApiCodes.STUFF_NOT_FOUND_BY_ID,
        message: "stuff with same id not found",
      });
  });
});
