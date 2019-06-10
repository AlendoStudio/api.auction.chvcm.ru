import {prepareApi} from "../../../common";

import {expect} from "chai";
import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, Stuff, Web} from "../../../../src";

describe("PATCH /stuffs/:id", () => {
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
      .expect(201);
  });

  describe("No Content 204", () => {
    it("empty request", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const stuff = (await Stuff.findByPk("1")) as Stuff;
      expect(stuff.amountType).equal("kg");
      expect(stuff.enabled).equal(true);
    });

    it("change amount type", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          amountType: "piece",
        })
        .expect(204);

      const stuff = (await Stuff.findByPk("1")) as Stuff;
      expect(stuff.amountType).equal("piece");
      expect(stuff.enabled).equal(true);
    });

    it("change enabled", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          enabled: false,
        })
        .expect(204);

      const stuff = (await Stuff.findByPk("1")) as Stuff;
      expect(stuff.amountType).equal("kg");
      expect(stuff.enabled).equal(false);
    });

    it("change amountType and enabled", async () => {
      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          amountType: "piece",
          enabled: false,
        })
        .expect(204);

      const stuff = (await Stuff.findByPk("1")) as Stuff;
      expect(stuff.amountType).equal("piece");
      expect(stuff.enabled).equal(false);
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amountType: "tn",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "amountType" fails because ["amountType" must be one of [kg, piece]]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        enabled: "yes",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "enabled" fails because ["enabled" must be a boolean]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        extraField: true,
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `"extraField" is not allowed`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
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
      .patch(`${Const.API_MOUNT_POINT}/stuffs/1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/stuffs/999`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        code: ApiCodes.STUFF_NOT_FOUND_BY_ID,
        message: "stuff with same id not found",
      });
  });
});
