interface IUserCommonAttributes {
  readonly banned?: boolean;
  readonly email?: string;
  readonly id?: string;
  readonly language?: string;
  readonly name?: string;
  readonly password?: string | null;
  readonly phone?: string;
  readonly registration?: Date;
  readonly tfa?: boolean;
}

export interface IUserAttributes extends IUserCommonAttributes {
  readonly type?: string;
}

export interface IEmployeeAttributes extends IUserCommonAttributes {
  readonly admin?: boolean;
  readonly moderator?: boolean;
}

export interface IEntityAttributes extends IUserCommonAttributes {
  readonly ceo?: string;
  readonly itn?: string;
  readonly psrn?: string;
  readonly verified?: boolean;
}

export interface ISignUser {
  readonly id: string;
  readonly type: string;
}
