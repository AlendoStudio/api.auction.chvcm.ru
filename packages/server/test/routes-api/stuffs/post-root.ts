import {prepareApi} from "../../common";

import {expect} from "chai";
import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Stuff, Web} from "../../../src";

describe("POST /stuffs", () => {
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
  });

  it("Created 201", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "kg",
      })
      .expect(201, {
        id: "1",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "piece",
      })
      .expect(201, {
        id: "2",
      });

    const stuff = await Stuff.findAndCountAll({
      order: [["id", "ASC"]],
    });

    expect(stuff.count).equal(2);

    expect(stuff.rows[0].id).equal("1");
    expect(stuff.rows[0].amountType).equal("kg");
    expect(stuff.rows[0].enabled).equal(true);

    expect(stuff.rows[1].id).equal("2");
    expect(stuff.rows[1].amountType).equal("piece");
    expect(stuff.rows[1].enabled).equal(true);
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "amountType" fails because ["amountType" is required]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "tn",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "amountType" fails because ["amountType" must be one of [kg, piece]]`,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "kg",
        extraField: true,
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .send({
        amountType: "kg",
      })
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer token`)
      .send({
        amountType: "kg",
      })
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
      .post(`${Const.API_MOUNT_POINT}/stuffs`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "kg",
      })
      .expect(403, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });
});
