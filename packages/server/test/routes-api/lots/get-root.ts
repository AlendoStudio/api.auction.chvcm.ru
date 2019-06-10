import {prepareApi} from "../../common";

import * as moment from "moment";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Employee,
  Entity,
  Lot,
  Web,
} from "../../../src";

describe("GET /lots", () => {
  prepareApi();

  let tokenEmployee: string;
  let tokenEntity: string;
  let start1: Date;
  let start2: Date;
  let finish1: Date;
  let finish2: Date;
  beforeEach(async () => {
    await Employee.create({
      email: "admin@example.com",
      language: "ru",
      moderator: true,
      name: "admin",
      password: await Bcrypt.hash("super mario"),
      phone: "+79123456789",
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
        ceo: "A Ceo",
        email: "a@example.com",
        itn: 77_04_59572_7,
        language: "en",
        name: "aaa",
        password: "super mario",
        phone: "+79123456781",
        psrn: 1_03_37_00_07067_8,
      })
      .expect(201)).body.token;

    await Entity.update(
      {
        verified: true,
      },
      {
        where: {
          id: "2",
        },
      },
    );

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .send({
        amountType: "kg",
      })
      .expect(201, {
        id: "1",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .send({
        amountType: "kg",
      })
      .expect(201, {
        id: "2",
      });

    start1 = moment()
      .add({minute: 10})
      .toDate();
    start2 = moment()
      .add({minute: 11})
      .toDate();
    finish1 = moment(start1)
      .add({minute: 10})
      .toDate();
    finish2 = moment(start2)
      .add({minute: 11})
      .toDate();

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .send({
        amount: 2.25,
        buffer: {
          minutes: 5,
        },
        currency: "rub",
        finish: finish1,
        start: start1,
        startBid: 1000,
        step: 100,
        strict: false,
        stuffId: "1",
        type: "sale",
      })
      .expect(201, {
        id: "1",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .send({
        amount: 100,
        buffer: {
          seconds: 59,
        },
        currency: "usd",
        finish: finish2,
        start: start2,
        startBid: 10_000,
        step: 1000,
        strict: true,
        stuffId: "1",
        type: "purchase",
      })
      .expect(201, {
        id: "2",
      });

    start2 = moment()
      .subtract({second: 1})
      .toDate();
    await Lot.update(
      {
        start: start2,
      },
      {
        where: {
          id: "2",
        },
      },
    );

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/lots/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        winnerBid: "0",
      })
      .expect(204);
  });

  it("Success 200", async () => {
    const lot1 = {
      amount: "2.25",
      buffer: {
        minutes: 5,
      },
      currency: "rub",
      finish: finish1.toISOString(),
      id: "1",
      participants: "0",
      start: start1.toISOString(),
      startBid: "1000",
      step: "100",
      strict: false,
      stuffId: "1",
      type: "sale",
      winnerBid: null,
      winnerId: null,
    };

    const lot2 = {
      amount: "100",
      buffer: {
        seconds: 59,
      },
      currency: "usd",
      finish: finish2.toISOString(),
      id: "2",
      participants: "1",
      start: start2.toISOString(),
      startBid: "10000",
      step: "1000",
      strict: true,
      stuffId: "1",
      type: "purchase",
      winnerBid: "10000",
      winnerId: "2",
    };

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(200, {
        data: [lot1, lot2],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/lots`)
      .query({
        limit: "1",
      })
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(200, {
        data: [lot1],
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/lots`)
      .query({
        offset: "1",
      })
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(200, {
        data: [lot2],
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .query({
        limit: "aaa",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "limit" fails because ["limit" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .query({
        offset: "aaa",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "offset" fails because ["offset" must be an integer]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/lots`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/lots`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });
});
