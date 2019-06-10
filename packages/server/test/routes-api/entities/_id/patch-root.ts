import {prepareApi} from "../../../common";

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
  Web,
} from "../../../../src";

describe("PATCH /entities/:id", () => {
  prepareApi();

  let tokenEmployee: string;
  let tokenEntity: string;
  beforeEach(async () => {
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
      describe("ban", () => {
        describe("without custom message", () => {
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banned: true,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledOnce(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Ваша учетная запись была забанена!",
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

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(true);
            expect(entity.verified).equal(false);
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banned: true,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledOnce(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Your account has been banned!",
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

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(true);
            expect(entity.verified).equal(false);
          });
        });

        describe("with custom message", () => {
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banMessage: "# Custom message",
                banned: true,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledOnce(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Ваша учетная запись была забанена!",
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
              expect(spyMail.args[0][0].originalMessage.html).contains(
                `Custom message</h1>`,
              );
              expect(spyMail.args[0][0].originalMessage.text).contains(
                `ООО "ПРИМЕР"`,
              );
              expect(spyMail.args[0][0].originalMessage.text).contains(
                "CUSTOM MESSAGE",
              );
            });

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(true);
            expect(entity.verified).equal(false);
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banMessage: "# Custom message",
                banned: true,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledOnce(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Your account has been banned!",
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
              expect(spyMail.args[0][0].originalMessage.html).contains(
                `Custom message</h1>`,
              );
              expect(spyMail.args[0][0].originalMessage.text).contains(
                `ООО "ПРИМЕР"`,
              );
              expect(spyMail.args[0][0].originalMessage.text).contains(
                "CUSTOM MESSAGE",
              );
            });

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(true);
            expect(entity.verified).equal(false);
          });
        });
      });

      describe("unban", () => {
        describe("verify", () => {
          it("ru email", async () => {
            await Entity.update(
              {
                banned: true,
                language: "ru",
                verified: false,
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banned: false,
                verified: true,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledTwice(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Ваша учетная запись была разбанена!",
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
              expect(spyMail.args[1][0].originalMessage.subject).equal(
                "Ваша учетная запись была проверена!",
              );
              expect(spyMail.args[1][0].originalMessage.from).equal(
                Env.EMAIL_FROM,
              );
              expect(spyMail.args[1][0].originalMessage.to).equal(
                "primer@yandex.ru",
              );
              expect(spyMail.args[1][0].originalMessage.html).contains(
                `ООО "ПРИМЕР"`,
              );
              expect(spyMail.args[1][0].originalMessage.text).contains(
                `ООО "ПРИМЕР"`,
              );
            });

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(false);
            expect(entity.verified).equal(true);
          });

          it("en email", async () => {
            await Entity.update(
              {
                banned: true,
                language: "en",
                verified: false,
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banned: false,
                verified: true,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledTwice(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Your account has been unbanned!",
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
              expect(spyMail.args[1][0].originalMessage.subject).equal(
                "Your account has been verified!",
              );
              expect(spyMail.args[1][0].originalMessage.from).equal(
                Env.EMAIL_FROM,
              );
              expect(spyMail.args[1][0].originalMessage.to).equal(
                "primer@yandex.ru",
              );
              expect(spyMail.args[1][0].originalMessage.html).contains(
                `ООО "ПРИМЕР"`,
              );
              expect(spyMail.args[1][0].originalMessage.text).contains(
                `ООО "ПРИМЕР"`,
              );
            });

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(false);
            expect(entity.verified).equal(true);
          });
        });

        describe("not verify", () => {
          it("ru email", async () => {
            await Entity.update(
              {
                banned: true,
                language: "ru",
                verified: false,
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banned: false,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledOnce(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Ваша учетная запись была разбанена!",
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

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(false);
            expect(entity.verified).equal(false);
          });

          it("en email", async () => {
            await Entity.update(
              {
                banned: true,
                language: "en",
                verified: false,
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
              .patch(`${Const.API_MOUNT_POINT}/entities/2`)
              .set("Authorization", `Bearer ${tokenEmployee}`)
              .send({
                banned: false,
              })
              .expect(204);

            await waitForExpect(() => {
              sinon.assert.calledOnce(spyMail);
              expect(spyMail.args[0][0].originalMessage.subject).equal(
                "Your account has been unbanned!",
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

            const entity = (await Entity.findByPk("2")) as Entity;
            expect(entity.banned).equal(false);
            expect(entity.verified).equal(false);
          });
        });
      });

      describe("verify", () => {
        it("ru email", async () => {
          await Entity.update(
            {
              language: "ru",
              verified: false,
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEmployee}`)
            .send({
              verified: true,
            })
            .expect(204);

          await waitForExpect(() => {
            sinon.assert.calledOnce(spyMail);
            expect(spyMail.args[0][0].originalMessage.subject).equal(
              "Ваша учетная запись была проверена!",
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

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.banned).equal(false);
          expect(entity.verified).equal(true);
        });

        it("en email", async () => {
          await Entity.update(
            {
              language: "en",
              verified: false,
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEmployee}`)
            .send({
              verified: true,
            })
            .expect(204);

          await waitForExpect(() => {
            sinon.assert.calledOnce(spyMail);
            expect(spyMail.args[0][0].originalMessage.subject).equal(
              "Your account has been verified!",
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

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.banned).equal(false);
          expect(entity.verified).equal(true);
        });
      });

      describe("unverify", () => {
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEmployee}`)
            .send({
              verified: false,
            })
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

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.banned).equal(false);
          expect(entity.verified).equal(false);
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEmployee}`)
            .send({
              verified: false,
            })
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

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.banned).equal(false);
          expect(entity.verified).equal(false);
        });
      });
    });

    describe("entity", () => {
      describe("change ceo", () => {
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEntity}`)
            .send({
              ceo: "Директор: Иванов Иван Иванович",
            })
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

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.ceo).equal("Директор: Иванов Иван Иванович");
          expect(entity.verified).equal(false);
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEntity}`)
            .send({
              ceo: "Директор: Иванов Иван Иванович",
            })
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

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.ceo).equal("Директор: Иванов Иван Иванович");
          expect(entity.verified).equal(false);
        });
      });

      describe("change name", () => {
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEntity}`)
            .send({
              name: `"Example" LLC`,
            })
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
              `"Example" LLC`,
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              `"Example" LLC`,
            );
          });

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.name).equal(`"Example" LLC`);
          expect(entity.verified).equal(false);
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
            .patch(`${Const.API_MOUNT_POINT}/entities/2`)
            .set("Authorization", `Bearer ${tokenEntity}`)
            .send({
              name: `"Example" LLC`,
            })
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
              `"Example" LLC`,
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              `"Example" LLC`,
            );
          });

          const entity = (await Entity.findByPk("2")) as Entity;
          expect(entity.name).equal(`"Example" LLC`);
          expect(entity.verified).equal(false);
        });
      });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/aaa`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        banMessage: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "banMessage" fails because ["banMessage" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        banned: "yes",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "banned" fails because ["banned" must be a boolean]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        ceo: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "ceo" fails because ["ceo" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        name: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "name" fails because ["name" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
      .send({
        verified: "yes",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "verified" fails because ["verified" must be a boolean]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEntity}`)
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
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/999`)
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
      .patch(`${Const.API_MOUNT_POINT}/entities/2`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(403, {
        code: ApiCodes.REQUIRED_SAME_ENTITY_OR_MODERATOR,
        message: "required entity with same id or moderator",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/entities/999`)
      .set("Authorization", `Bearer ${tokenEmployee}`)
      .set("Content-Type", "application/octet-stream")
      .expect(404, {
        code: ApiCodes.ENTITY_NOT_FOUND_BY_ID,
        message: "entity with same id not found",
      });
  });
});
