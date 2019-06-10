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

describe("DELETE /stuffs/:id/translations/:code", () => {
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

  it("No content 204", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Gold",
      })
      .expect(204);

    await supertest(Web.instance.app)
      .delete(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    let count = await StuffTranslation.count({
      where: {
        stuffId: "1",
      },
    });
    expect(count).equal(0);

    await supertest(Web.instance.app)
      .delete(`${Const.API_MOUNT_POINT}/stuffs/1/translations/ru`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    count = await StuffTranslation.count({
      where: {
        stuffId: "1",
      },
    });
    expect(count).equal(0);
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .delete(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .delete(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
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
      .delete(`${Const.API_MOUNT_POINT}/stuffs/1/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_MODERATOR,
        message: "required moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .delete(`${Const.API_MOUNT_POINT}/stuffs/999/translations/en`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        code: ApiCodes.STUFF_NOT_FOUND_BY_ID,
        message: "stuff with same id not found",
      });
  });
});
