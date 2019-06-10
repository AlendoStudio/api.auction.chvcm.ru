import * as nodemailer from "nodemailer";

export interface IEmailOptions {
  locals: unknown;
  message: nodemailer.SendMailOptions;
  template: string;
}

export interface IEmailUser {
  email?: string;
  language?: string;
  name?: string;
}
