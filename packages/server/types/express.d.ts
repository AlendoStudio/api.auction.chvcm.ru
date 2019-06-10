import {IEmployeeAttributes, IEntityAttributes, IUserAttributes} from "../src";

declare global {
  namespace Express {
    export interface Request {
      employee: IEmployeeAttributes;
      entity: IEntityAttributes;
      user: IUserAttributes;
    }
  }
}
