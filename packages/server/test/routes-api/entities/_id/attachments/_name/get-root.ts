import {prepareApi} from "../../../../../common";

import {expect} from "chai";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  Employee,
  S3,
  Web,
} from "../../../../../../src";

describe("GET /entities/:id/attachments/:name", () => {
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
      tfa: false,
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

  describe("Success 200", () => {
    it("empty body", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .set("Content-Type", "application/octet-stream")
        .expect(204);

      const resEntity = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .set("Content-Type", "application/octet-stream")
        .expect(200, Buffer.of());
      expect(resEntity.type).equal("application/octet-stream");

      const resEmployee = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .expect(200, Buffer.of());
      expect(resEmployee.type).equal("application/octet-stream");
    });

    it("text body", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .set("Content-Type", "application/octet-stream")
        .send("Hello AWS!")
        .expect(204);

      const resEntity = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .expect(200, Buffer.from("Hello AWS!"));
      expect(resEntity.type).equal("application/octet-stream");

      const resEmployee = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .expect(200, Buffer.from("Hello AWS!"));
      expect(resEmployee.type).equal("application/octet-stream");
    });

    it("bin body", async () => {
      await supertest(Web.instance.app)
        .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .set("Content-Type", "application/octet-stream")
        .send(Buffer.of(0, 1, 200, 0, 20, 40))
        .expect(204);

      const resEntity = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEntity}`)
        .expect(200, Buffer.of(0, 1, 200, 0, 20, 40));
      expect(resEntity.type).equal("application/octet-stream");

      const resEmployee = await supertest(Web.instance.app)
        .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
        .set("Authorization", `Bearer ${tokenEmployee}`)
        .expect(200, Buffer.of(0, 1, 200, 0, 20, 40));
      expect(resEmployee.type).equal("application/octet-stream");
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/aaa/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "name" fails because ["name" with value "files" fails to match the required pattern: /^[a-zA-Zа-яА-Я0-9_\\-]([a-zA-Zа-яА-Я0-9_\\- ]*(\\.\\w+)?)*\\.\\w+$/]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/999/attachments/files.zip`)
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
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(403, {
        code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR,
        message: "required entity with same id or moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/999/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .expect(404, {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
        message: "entity with same id not found",
      });

    await supertest(Web.instance.app)
      .get(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(404, {
        code: ApiCodes.ATTACHMENT_NOT_FOUND_BY_NAME,
        message: "attachment with same name not found",
      });
  });
});
