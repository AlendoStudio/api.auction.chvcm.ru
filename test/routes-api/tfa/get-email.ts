import {reCaptchaMockAdapter} from "../../common";

import {expect} from "chai";
import * as cuid from "cuid";
import {beforeEach, describe, it} from "mocha";
import * as sinon from "sinon";
import * as supertest from "supertest";

import {
  ApiCodes,
  Bcrypt,
  Const,
  EmailNotifications,
  Env,
  Recaptcha2,
  Sequelize,
  Web,
} from "../../../src";

describe("GET /tfa/email", () => {
  let purgatoryToken: string;
  beforeEach(async () => {
    reCaptchaMockAdapter.onPost(Recaptcha2.VERIFY_URL).reply(200, {
      success: true,
    });
    await Sequelize.instance.employee.insertOrUpdate({
      email: "admin@example.com",
      language: "ru",
      name: "admin",
      password: await Bcrypt.hash("super duper password"),
      phone: "+79123456789",
      tfa: true,
    });
    purgatoryToken = (await supertest(Web.instance.app).post(`${Const.API_MOUNT_POINT}/signin`)
      .send({
        email: "admin@example.com",
        password: "super duper password",
      })
      .expect(200)).body.token;
  });

  it("user was banned", async () => {
    await Sequelize.instance.employee.update({
      banned: true,
    }, {
      where: {
        id: "1",
      },
    });
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/tfa/email`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .expect(401, {
        code: ApiCodes.BANNED,
        message: "user was banned",
      });
  });

  it("user not found by purgatory token (token does not exists)", async () => {
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/tfa/email`)
      .set("Authorization", `Bearer ${cuid()}`)
      .expect(401, {
        code: ApiCodes.DB_USER_NOT_FOUND_BY_PURGATORY_TOKEN,
        message: "user not found by purgatory token",
      });
  });

  it("user not found by purgatory token (expired token)", async () => {
    await Sequelize.instance.tokensTfaPurgatory.update({
      expires: new Date(),
    }, {
      where: {
        token: purgatoryToken,
      },
    });
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/tfa/email`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .expect(401, {
        code: ApiCodes.DB_USER_NOT_FOUND_BY_PURGATORY_TOKEN,
        message: "user not found by purgatory token",
      });
  });

  it("correct - ru email", async () => {
    await Sequelize.instance.employee.update({
      language: "ru",
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/tfa/email`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .expect(204);

    const token = await Sequelize.instance.tokensTfaEmail.findAll({
      where: {
        purgatory: purgatoryToken,
      },
    });
    expect(token.length).equal(1);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Двухфакторная аутентификация!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.html).contains(token[0].token as string);
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains(token[0].token as string);
  });

  it("correct - en email", async () => {
    await Sequelize.instance.employee.update({
      language: "en",
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/tfa/email`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .expect(204);

    const token = await Sequelize.instance.tokensTfaEmail.findAll({
      where: {
        purgatory: purgatoryToken,
      },
    });
    expect(token.length).equal(1);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Two Factor Authentication!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.html).contains(token[0].token as string);
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains(token[0].token as string);
  });

  it("correct - other email", async () => {
    await Sequelize.instance.employee.update({
      language: "de",
    }, {
      where: {
        id: "1",
      },
    });
    const spyMail = sinon.stub();
    EmailNotifications.instance.on(EmailNotifications.EMAIL_EVENT, spyMail);
    await supertest(Web.instance.app).get(`${Const.API_MOUNT_POINT}/tfa/email`)
      .set("Authorization", `Bearer ${purgatoryToken}`)
      .expect(204);

    const token = await Sequelize.instance.tokensTfaEmail.findAll({
      where: {
        purgatory: purgatoryToken,
      },
    });
    expect(token.length).equal(1);

    sinon.assert.calledOnce(spyMail);
    expect(spyMail.args[0][0].originalMessage.subject).equal("Two Factor Authentication!");
    expect(spyMail.args[0][0].originalMessage.from).equal(Env.EMAIL_FROM);
    expect(spyMail.args[0][0].originalMessage.to).equal("admin@example.com");
    expect(spyMail.args[0][0].originalMessage.html).contains("admin");
    expect(spyMail.args[0][0].originalMessage.html).contains(token[0].token as string);
    expect(spyMail.args[0][0].originalMessage.text).contains("admin");
    expect(spyMail.args[0][0].originalMessage.text).contains(token[0].token as string);
  });
});
