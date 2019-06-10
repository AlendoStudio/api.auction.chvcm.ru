import {prepareApi} from "../../../../../common";

import * as bytes from "bytes";
import {expect} from "chai";
import * as sinon from "sinon";
import * as supertest from "supertest";
import waitForExpect from "wait-for-expect";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  Employee,
  Entity,
  Env,
  S3,
  Web,
} from "../../../../../../src";

describe("PUT /entities/:id/attachments/:name", () => {
  prepareApi();

  let tokenEmployee: string;
  let tokenEntity: string;
  beforeEach(async () => {
    await S3.deleteBucket();
    await S3.createBucket();

    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

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

    await waitForExpect(() => {
      sinon.assert.calledTwice(spyMail);
    });
  });

  describe("No Content 204", () => {
    describe("employee", () => {
      describe("verified", () => {
        it("ru email", async () => {
          await Entity.update(
            {
              language: "ru",
              verified: true,
            },
            {
              where: {
                id: "2",
              },
            },
          );

          const spyMail = sinon.stub();
          EmailNotifications.instance.on(
            EmailNotifications.EMAIL_EVENT,
            spyMail,
          );

          await supertest(Web.instance.app)
            .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
            .set("Authorization", `Bearer ${tokenEmployee}`)
            .set("Content-Type", "application/octet-stream")
            .expect(204);

          await waitForExpect(() => {
            sinon.assert.calledOnce(spyMail);
            expect(spyMail.args[0][0].originalMessage.subject).equal(
              "Ваша учетная запись ожидает проверки!",
            );
            expect(spyMail.args[0][0].originalMessage.from).equal(
              Env.EMAIL_FROM,
            );
            expect(spyMail.args[0][0].originalMessage.to).equal(
              "primer@yandex.ru",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              `ООО "ПРИМЕР"`,
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              `ООО "ПРИМЕР"`,
            );
          });

          const filesZip = await S3.client
            .getObject({
              Bucket: Env.AWS_S3_BUCKET,
              Key: S3.entityAttachment("2", "files.zip"),
            })
            .promise();

          expect(Buffer.compare(filesZip.Body as Buffer, Buffer.of())).equal(0);
          expect(((await Entity.findByPk("2")) as Entity).verified).equal(
            false,
          );
        });

        it("en email", async () => {
          await Entity.update(
            {
              language: "en",
              verified: true,
            },
            {
              where: {
                id: "2",
              },
            },
          );

          const spyMail = sinon.stub();
          EmailNotifications.instance.on(
            EmailNotifications.EMAIL_EVENT,
            spyMail,
          );

          await supertest(Web.instance.app)
            .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
            .set("Authorization", `Bearer ${tokenEmployee}`)
            .set("Content-Type", "application/octet-stream")
            .expect(204);

          await waitForExpect(() => {
            sinon.assert.calledOnce(spyMail);
            expect(spyMail.args[0][0].originalMessage.subject).equal(
              "Your account is awaiting verification!",
            );
            expect(spyMail.args[0][0].originalMessage.from).equal(
              Env.EMAIL_FROM,
            );
            expect(spyMail.args[0][0].originalMessage.to).equal(
              "primer@yandex.ru",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              `ООО "ПРИМЕР"`,
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              `ООО "ПРИМЕР"`,
            );
          });

          const filesZip = await S3.client
            .getObject({
              Bucket: Env.AWS_S3_BUCKET,
              Key: S3.entityAttachment("2", "files.zip"),
            })
            .promise();

          expect(Buffer.compare(filesZip.Body as Buffer, Buffer.of())).equal(0);
          expect(((await Entity.findByPk("2")) as Entity).verified).equal(
            false,
          );
        });
      });
    });

    describe("entity", () => {
      it("text body", async () => {
        await supertest(Web.instance.app)
          .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
          .set("Authorization", `Bearer ${tokenEntity}`)
          .set("Content-Type", "application/octet-stream")
          .send("Рыба Текст")
          .expect(204);

        const filesZip = await S3.client
          .getObject({
            Bucket: Env.AWS_S3_BUCKET,
            Key: S3.entityAttachment("2", "files.zip"),
          })
          .promise();

        expect(
          Buffer.compare(filesZip.Body as Buffer, Buffer.from("Рыба Текст")),
        ).equal(0);
      });

      it("bin body", async () => {
        await supertest(Web.instance.app)
          .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
          .set("Authorization", `Bearer ${tokenEntity}`)
          .set("Content-Type", "application/octet-stream")
          .send(Buffer.of(0, 1, 200, 0, 20, 40))
          .expect(204);

        const filesZip = await S3.client
          .getObject({
            Bucket: Env.AWS_S3_BUCKET,
            Key: S3.entityAttachment("2", "files.zip"),
          })
          .promise();

        expect(
          Buffer.compare(
            filesZip.Body as Buffer,
            Buffer.of(0, 1, 200, 0, 20, 40),
          ),
        ).equal(0);
      });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/aaa/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "name" fails because ["name" with value "files" fails to match the required pattern: /^[a-zA-Zа-яА-Я0-9_\\-]([a-zA-Zа-яА-Я0-9_\\- ]*(\\.\\w+)?)*\\.\\w+$/]`,
      });
  });

  it("Unauthorized 401", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/999/attachments/files.zip`)
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
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(403, {
        code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR,
        message: "required entity with same id or moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/999/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(404, {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
        message: "entity with same id not found",
      });
  });

  it("Payload To Large 413", async () => {
    await supertest(Web.instance.app)
      .put(`${Const.API_MOUNT_POINT}/entities/2/attachments/files.zip`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .set("Content-Type", "application/octet-stream")
      .send(Buffer.alloc(bytes("2mb")).fill(0))
      .expect(413, {
        code: ApiCodes.PAYLOAD_TOO_LARGE,
        message: "request entity too large",
      });
  });
});
