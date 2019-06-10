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
  Env,
  Web,
} from "../../../../src";

describe("PATCH /employees/:id", () => {
  prepareApi();

  let token: string;
  beforeEach(async () => {
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

    await Employee.create({
      admin: true,
      email: "admin@example.com",
      language: "ru",
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
      .post(`${Const.API_MOUNT_POINT}/employees`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: "moderator@example.com",
        language: "ru",
        name: "moderator",
        phone: "+79123456780",
      })
      .expect(201, {
        id: "2",
      });

    await waitForExpect(() => {
      sinon.assert.calledTwice(spyMail);
    });
  });

  describe("No Content 204", () => {
    it("grant moderator", async () => {
      await Employee.update(
        {
          banned: false,
          moderator: false,
        },
        {
          where: {
            id: "2",
          },
        },
      );

      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/employees/2`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          moderator: true,
        })
        .expect(204);

      const employee = (await Employee.findByPk("2")) as Employee;
      expect(employee.banned).equal(false);
      expect(employee.moderator).equal(true);
    });

    it("prohibit moderator", async () => {
      await Employee.update(
        {
          banned: false,
          moderator: true,
        },
        {
          where: {
            id: "2",
          },
        },
      );

      await supertest(Web.instance.app)
        .patch(`${Const.API_MOUNT_POINT}/employees/2`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          moderator: false,
        })
        .expect(204);

      const employee = (await Employee.findByPk("2")) as Employee;
      expect(employee.banned).equal(false);
      expect(employee.moderator).equal(false);
    });

    describe("ban", () => {
      describe("without custom message", () => {
        it("ru email", async () => {
          await Employee.update(
            {
              banned: false,
              language: "ru",
              moderator: false,
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
            .patch(`${Const.API_MOUNT_POINT}/employees/2`)
            .set("Authorization", `Bearer ${token}`)
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
              "moderator@example.com",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              "moderator",
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              "moderator",
            );
          });

          const employee = (await Employee.findByPk("2")) as Employee;
          expect(employee.banned).equal(true);
          expect(employee.moderator).equal(false);
        });

        it("en email", async () => {
          await Employee.update(
            {
              banned: false,
              language: "en",
              moderator: false,
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
            .patch(`${Const.API_MOUNT_POINT}/employees/2`)
            .set("Authorization", `Bearer ${token}`)
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
              "moderator@example.com",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              "moderator",
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              "moderator",
            );
          });

          const employee = (await Employee.findByPk("2")) as Employee;
          expect(employee.banned).equal(true);
          expect(employee.moderator).equal(false);
        });
      });

      describe("with custom message", () => {
        it("ru email", async () => {
          await Employee.update(
            {
              banned: false,
              language: "ru",
              moderator: false,
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
            .patch(`${Const.API_MOUNT_POINT}/employees/2`)
            .set("Authorization", `Bearer ${token}`)
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
              "moderator@example.com",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              "moderator",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              `Custom message</h1>`,
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              "moderator",
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              "CUSTOM MESSAGE",
            );
          });

          const employee = (await Employee.findByPk("2")) as Employee;
          expect(employee.banned).equal(true);
          expect(employee.moderator).equal(false);
        });

        it("en email", async () => {
          await Employee.update(
            {
              banned: false,
              language: "en",
              moderator: false,
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
            .patch(`${Const.API_MOUNT_POINT}/employees/2`)
            .set("Authorization", `Bearer ${token}`)
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
              "moderator@example.com",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              "moderator",
            );
            expect(spyMail.args[0][0].originalMessage.html).contains(
              `Custom message</h1>`,
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              "moderator",
            );
            expect(spyMail.args[0][0].originalMessage.text).contains(
              "CUSTOM MESSAGE",
            );
          });

          const employee = (await Employee.findByPk("2")) as Employee;
          expect(employee.banned).equal(true);
          expect(employee.moderator).equal(false);
        });
      });
    });

    describe("unban", () => {
      it("ru email", async () => {
        await Employee.update(
          {
            banned: true,
            language: "ru",
            moderator: false,
          },
          {
            where: {
              id: "2",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        await supertest(Web.instance.app)
          .patch(`${Const.API_MOUNT_POINT}/employees/2`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            banned: false,
          })
          .expect(204);

        await waitForExpect(() => {
          sinon.assert.calledOnce(spyMail);
          expect(spyMail.args[0][0].originalMessage.subject).equal(
            "Ваша учетная запись была разбанена!",
          );
          expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
          expect(spyMail.args[0][0].originalMessage.to).equal(
            "moderator@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
          expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
        });

        const employee = (await Employee.findByPk("2")) as Employee;
        expect(employee.banned).equal(false);
        expect(employee.moderator).equal(false);
      });

      it("en email", async () => {
        await Employee.update(
          {
            banned: true,
            language: "en",
            moderator: false,
          },
          {
            where: {
              id: "2",
            },
          },
        );

        const spyMail = sinon.stub();
        EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);

        await supertest(Web.instance.app)
          .patch(`${Const.API_MOUNT_POINT}/employees/2`)
          .set("Authorization", `Bearer ${token}`)
          .send({
            banned: false,
          })
          .expect(204);

        await waitForExpect(() => {
          sinon.assert.calledOnce(spyMail);
          expect(spyMail.args[0][0].originalMessage.subject).equal(
            "Your account has been unbanned!",
          );
          expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
          expect(spyMail.args[0][0].originalMessage.to).equal(
            "moderator@example.com",
          );
          expect(spyMail.args[0][0].originalMessage.html).contains("moderator");
          expect(spyMail.args[0][0].originalMessage.text).contains("moderator");
        });

        const employee = (await Employee.findByPk("2")) as Employee;
        expect(employee.banned).equal(false);
        expect(employee.moderator).equal(false);
      });
    });
  });

  it("Bad Request 400", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/aaa`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banMessage: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "id" fails because ["id" must be an integer]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banMessage: "",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "banMessage" fails because ["banMessage" is not allowed to be empty]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        banned: "yes",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "banned" fails because ["banned" must be a boolean]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/2`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        moderator: "yes",
      })
      .expect(400, {
        code: ApiCodes.BAD_REQUEST,
        message: `child "moderator" fails because ["moderator" must be a boolean]`,
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/2`)
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
      .patch(`${Const.API_MOUNT_POINT}/employees/2`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt must be provided",
      });

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/2`)
      .set("Authorization", `Bearer token`)
      .expect(401, {
        code: ApiCodes.JWT_VERIFY_USER,
        message: "jwt malformed",
      });
  });

  it("Forbidden 403", async () => {
    await Employee.update(
      {
        admin: false,
      },
      {
        where: {
          id: "1",
        },
      },
    );

    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/2`)
      .set("Authorization", `Bearer ${token}`)
      .expect(403, {
        code: ApiCodes.REQUIRED_ADMIN,
        message: "required admin",
      });
  });

  it("Not Found 404", async () => {
    await supertest(Web.instance.app)
      .patch(`${Const.API_MOUNT_POINT}/employees/999`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404, {
        code: ApiCodes.EMPLOYEE_NOT_FOUND_BY_ID,
        message: "employee with same id not found",
      });
  });
});
