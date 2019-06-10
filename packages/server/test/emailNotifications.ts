import "./common";

import {Const, EmailNotifications, Env, renderMarkdown} from "../src";

describe("EmailNotifications", () => {
  beforeEach(() => {
    EmailNotifications.instantiateSmtp();
  });

  if (!(Const.STAGING && Env.EMAIL_PREVIEW)) {
    return;
  }

  it("banned en (with custom message)", async () => {
    await EmailNotifications.instance.banned(
      {
        email: "customer@organisation.com",
        language: "en",
        name: "Customer Inc.",
      },
      await renderMarkdown(`
We were forced to ban your account because of **suspicious** activity.

In order to get access to your account again, you need in your reply email:

1. Provide a passport photo in hand
1. Specify the list of IP addresses you use

Thank you for understanding!
`),
    );
  });

  it("banned ru (with custom message)", async () => {
    await EmailNotifications.instance.banned(
      {
        email: "customer@organisation.com",
        language: "ru",
        name: `ООО "Трубопрокатный завод"`,
      },
      await renderMarkdown(`
Мы были вынуждены забанить вашу учетную запись из-за **подозрительной** активности.

Для того чтобы вновь получить доступ к аккаунту вам необходимо в ответном письме:

1. Предоставить фотографию с паспортом в руках
1. Указать список используемых вами IP адресов

Спасибо за понимание!
`),
    );
  });

  it("banned en", async () => {
    await EmailNotifications.instance.banned({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("banned ru", async () => {
    await EmailNotifications.instance.banned({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });

  it("inviteEmployee en", async () => {
    await EmailNotifications.instance.inviteEmployee({
      email: "employee@chvcm.ru",
      language: "en",
      name: "John Doe",
    });
  });

  it("inviteEmployee ru", async () => {
    await EmailNotifications.instance.inviteEmployee({
      email: "employee@chvcm.ru",
      language: "ru",
      name: "Василий Петрович",
    });
  });

  it("passwordReset en", async () => {
    await EmailNotifications.instance.passwordReset(
      {
        email: "customer@organisation.com",
        language: "en",
        name: "Customer Inc.",
      },
      "cjofijc0b000479zmtfwzai70",
    );
  });

  it("passwordReset ru", async () => {
    await EmailNotifications.instance.passwordReset(
      {
        email: "customer@organisation.com",
        language: "ru",
        name: `ООО "Трубопрокатный завод"`,
      },
      "cjofijc0b000479zmtfwzai70",
    );
  });

  it("passwordResetComplete en", async () => {
    await EmailNotifications.instance.passwordResetComplete({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("passwordResetComplete ru", async () => {
    await EmailNotifications.instance.passwordResetComplete({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });

  it("signin en", async () => {
    await EmailNotifications.instance.signin({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("signin ru", async () => {
    await EmailNotifications.instance.signin({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });

  it("signinTfa en", async () => {
    await EmailNotifications.instance.signinTfa({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("signinTfa ru", async () => {
    await EmailNotifications.instance.signinTfa({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });

  it("signup en", async () => {
    await EmailNotifications.instance.signup({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("signup ru", async () => {
    await EmailNotifications.instance.signup({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });

  it("test en", async () => {
    await EmailNotifications.instance.test("customer@organisation.com", "en");
  });

  it("test ru", async () => {
    await EmailNotifications.instance.test("customer@organisation.com", "ru");
  });

  it("unbanned en", async () => {
    await EmailNotifications.instance.unbanned({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("unbanned ru", async () => {
    await EmailNotifications.instance.unbanned({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });

  it("unverified en", async () => {
    await EmailNotifications.instance.unverified({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("unverified ru", async () => {
    await EmailNotifications.instance.unverified({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });

  it("verified en", async () => {
    await EmailNotifications.instance.verified({
      email: "customer@organisation.com",
      language: "en",
      name: "Customer Inc.",
    });
  });

  it("verified ru", async () => {
    await EmailNotifications.instance.verified({
      email: "customer@organisation.com",
      language: "ru",
      name: `ООО "Трубопрокатный завод"`,
    });
  });
});
