import {prepareApi} from "../../common";

import * as supertest from "supertest";

import {Const, Web} from "../../../src";

describe("ALL /utils/ping", () => {
  prepareApi();

  it("Success 200", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/utils/ping`)
      .expect(200, {
        pong: true,
      });

    await supertest(Web.instance.app)
      .post(`${Const.API_MOUNT_POINT}/utils/ping`)
      .expect(200, {
        pong: true,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/utils/ping`)
      .expect(200, {
        pong: true,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/utils/ping`)
      .expect(200, {
        pong: true,
      });

    await supertest(Web.instance.app)
      .delete(`${Const.API_MOUNT_POINT}/utils/ping`)
      .expect(200, {
        pong: true,
      });
  });
});
