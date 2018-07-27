import {IEmployeeAttributes, IEntityAttributes, IUserAttributes, ResponseChain} from "../src";

declare global {
  namespace Express {
    // tslint:disable interface-name
    // noinspection JSUnusedGlobalSymbols
    export interface Request {
      employee: IEmployeeAttributes;
      entity: IEntityAttributes;
      user: IUserAttributes;
      readonly token: string;
    }

    // noinspection JSUnusedGlobalSymbols
    export interface Response {
      achain: ResponseChain;
    }
  }
}
