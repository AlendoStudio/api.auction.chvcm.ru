import {prepareApi} from "../../../../common";

import * as supertest from "supertest";

import {ApiCodes, Bcrypt, Const, Employee, S3, Web} from "../../../../../src";

describe("GET /entities/:id/attachments", () => {
  prepareApi();

  let tokenEmployee: string;
  let tokenEntity: string;
  beforeEach(async () => {
    await S3.deleteBucket();
    await S3.createBucket();

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
  });

  it("Success 200", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files_3.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .expect(204);

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files_20.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .expect(204);

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files_2.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .expect(204);

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files_10.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .expect(204);

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files_1.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .send("1234567890")
      .expect(204);

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .expect(200, {
        data: [
          {
            name: "files_1.zip",
            size: 10,
          },
          {
            name: "files_10.zip",
            size: 0,
          },
          {
            name: "files_2.zip",
            size: 0,
          },
          {
            name: "files_20.zip",
            size: 0,
          },
          {
            name: "files_3.zip",
            size: 0,
          },
        ],
        meta: {
          nextOffset: null,
        },
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .query({
        limit: "3",
      })
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(200, {
        data: [
          {
            name: "files_1.zip",
            size: 10,
          },
          {
            name: "files_10.zip",
            size: 0,
          },
          {
            name: "files_2.zip",
            size: 0,
          },
        ],
        meta: {
          nextOffset: S3.entityAttachment("2", "files_2.zip"),
        },
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .query({
        offset: S3.entityAttachment("2", "files_2.zip"),
      })
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .expect(200, {
        data: [
          {
            name: "files_20.zip",
            size: 0,
          },
          {
            name: "files_3.zip",
            size: 0,
          },
        ],
        meta: {
          nextOffset: null,
        },
      });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/aaa/attachments`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .query({
        limit: "aaa",
      })
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "limit" fails because ["limit" must be a number]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .query({
        limit: Const.AWS_S3_LIMIT_LIMIT + 1,
      })
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "limit" fails because ["limit" must be less than or equal to ${Const.AWS_S3_LIMIT_LIMIT}]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .query({
        limit: -1,
      })
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "limit" fails because ["limit" must be larger than or equal to 0]`,
      });
  });

  it("401 Unauthorized", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/999/attachments`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .expect(403, {
        code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR,
        message: "required entity with same id or moderator",
      });

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
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(403, {
        code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR,
        message: "required entity with same id or moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/999/attachments`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(404, {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
        message: "entity with same id not found",
      });
  });
});
