interface IBody {
  key: string;
  value: {
    data: any;
    type: string;
  };
}

interface IDictionary {
  enabled: boolean;
  key: string;
  value: string;
}

interface IRequesterPresets {
  [group: string]: {
    [preset: string]: {
      body?: IBody[];
      contentType?: string;
      docs: string;
      headers?: IDictionary[];
      method: string;
      params?: IDictionary[];
      path: string;
      query?: IDictionary[];
      recaptcha?: boolean;
    };
  };
}

const requesterPresets: IRequesterPresets = {
  Employees: {
    "GET /employees": {
      docs: "#api-Employees-ListEmployees",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      path: "/employees",
      query: [
        {
          enabled: false,
          key: "limit",
          value: "",
        },
        {
          enabled: false,
          key: "offset",
          value: "",
        },
      ],
    },
    "GET /employees/:id": {
      docs: "#api-Employees-GetEmployee",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/employees/:id",
    },
    "POST /employees": {
      body: [
        {
          key: "email",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "language",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "name",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "phone",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Employees-InviteEmployee",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "post",
      path: "/employees",
    },
    "PATCH /employees/:id": {
      body: [
        {
          key: "banMessage",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "banned",
          value: {
            data: false,
            type: "boolean",
          },
        },
        {
          key: "moderator",
          value: {
            data: false,
            type: "boolean",
          },
        },
      ],
      docs: "#api-Employees-ChangeEmployee",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "patch",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/employees/:id",
    },
  },
  Entities: {
    "GET /entities": {
      docs: "#api-Entities-ListEntities",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      path: "/entities",
      query: [
        {
          enabled: false,
          key: "limit",
          value: "",
        },
        {
          enabled: false,
          key: "offset",
          value: "",
        },
      ],
    },
    "GET /entities/:id": {
      docs: "#api-Entities-GetEntity",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/entities/:id",
    },
    "GET /entities/:id/attachments": {
      docs: "#api-Entities-ListAttachments",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/entities/:id/attachments",
      query: [
        {
          enabled: false,
          key: "limit",
          value: "",
        },
        {
          enabled: false,
          key: "offset",
          value: "",
        },
      ],
    },
    "GET /entities/:id/attachments/:name": {
      docs: "#api-Entities-DownloadAttachment",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
        {
          enabled: true,
          key: ":name",
          value: "",
        },
      ],
      path: "/entities/:id/attachments/:name",
    },
    "POST /entities": {
      body: [
        {
          key: "ceo",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "email",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "itn",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "language",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "name",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "password",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "phone",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "psrn",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Entities-SignUp",
      method: "post",
      path: "/entities",
      recaptcha: true,
    },
    "PUT /entities/:id/attachments/:name": {
      contentType: "binary",
      docs: "#api-Entities-UploadAttachment",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "put",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
        {
          enabled: true,
          key: ":name",
          value: "",
        },
      ],
      path: "/entities/:id/attachments/:name",
    },
    "PATCH /entities/:id": {
      body: [
        {
          key: "banMessage",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "banned",
          value: {
            data: false,
            type: "boolean",
          },
        },
        {
          key: "ceo",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "name",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "verified",
          value: {
            data: false,
            type: "boolean",
          },
        },
      ],
      docs: "#api-Entities-ChangeEntity",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "patch",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/entities/:id",
    },
    "DELETE /entities/:id/attachments/:name": {
      docs: "#api-Entities-DeleteAttachment",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "delete",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
        {
          enabled: true,
          key: ":name",
          value: "",
        },
      ],
      path: "/entities/:id/attachments/:name",
    },
  },
  Lots: {
    "GET /lots": {
      docs: "#api-Lots-ListLots",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      path: "/lots",
      query: [
        {
          enabled: false,
          key: "limit",
          value: "",
        },
        {
          enabled: false,
          key: "offset",
          value: "",
        },
      ],
    },
    "GET /lots/:id": {
      docs: "#api-Lots-GetLot",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/lots/:id",
    },
    "POST /lots": {
      body: [
        {
          key: "amount",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "buffer",
          value: {
            data: {},
            type: "interval",
          },
        },
        {
          key: "currency",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "finish",
          value: {
            data: "NaN",
            type: "date",
          },
        },
        {
          key: "start",
          value: {
            data: "NaN",
            type: "date",
          },
        },
        {
          key: "startBid",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "step",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "strict",
          value: {
            data: false,
            type: "boolean",
          },
        },
        {
          key: "stuffId",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "type",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Lots-CreateLot",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "post",
      path: "/lots",
    },
    "PATCH /lots/:id": {
      body: [
        {
          key: "winnerBid",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Lots-ChangeLot",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "patch",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/lots/:id",
    },
  },
  "Sign in": {
    "POST /signin": {
      body: [
        {
          key: "email",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "password",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-SignIn-SignIn",
      method: "post",
      path: "/signin",
      recaptcha: true,
    },
    "PUT /signin": {
      body: [
        {
          key: "token",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "type",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-SignIn-SignInWithTFA",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{purgatoryToken}}",
        },
      ],
      method: "put",
      path: "/signin",
    },
  },
  Stuffs: {
    "GET /stuffs": {
      docs: "#api-Stuffs-ListStuffs",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      path: "/stuffs",
      query: [
        {
          enabled: false,
          key: "limit",
          value: "",
        },
        {
          enabled: false,
          key: "offset",
          value: "",
        },
      ],
    },
    "GET /stuffs/:id": {
      docs: "#api-Stuffs-GetStuff",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/stuffs/:id",
    },
    "GET /stuffs/:id/translations": {
      docs: "#api-Stuffs-ListTranslations",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/stuffs/:id/translations",
    },
    "GET /stuffs/:id/translations/:code": {
      docs: "#api-Stuffs-GetTranslation",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
        {
          enabled: true,
          key: ":code",
          value: "",
        },
      ],
      path: "/stuffs/:id/translations/:code",
    },
    "POST /stuffs": {
      body: [
        {
          key: "amountType",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Stuffs-CreateStuff",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "post",
      path: "/stuffs",
    },
    "PUT /stuffs/:id/translations/:code": {
      body: [
        {
          key: "title",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "description",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Stuffs-TranslateStuff",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "put",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
        {
          enabled: true,
          key: ":code",
          value: "",
        },
      ],
      path: "/stuffs/:id/translations/:code",
    },
    "PATCH /stuffs/:id": {
      body: [
        {
          key: "amountType",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "enabled",
          value: {
            data: false,
            type: "boolean",
          },
        },
      ],
      docs: "#api-Stuffs-ChangeStuff",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "patch",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
      ],
      path: "/stuffs/:id",
    },
    "DELETE /stuffs/:id/translations/:code": {
      docs: "#api-Stuffs-DeleteTranslation",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "delete",
      params: [
        {
          enabled: true,
          key: ":id",
          value: "",
        },
        {
          enabled: true,
          key: ":code",
          value: "",
        },
      ],
      path: "/stuffs/:id/translations/:code",
    },
  },
  User: {
    "GET /user": {
      docs: "#api-User-InfoAboutYourself",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "get",
      path: "/user",
    },
    "POST /user/tfa/otp": {
      body: [
        {
          key: "token",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-User-CheckOTP",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "post",
      path: "/user/tfa/otp",
    },
    "PUT /user/tfa/otp": {
      body: [
        {
          key: "type",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-User-GenerateOTP",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "put",
      path: "/user/tfa/otp",
    },
    "PUT /user/tfa/recovery": {
      docs: "#api-User-GenerateRecoveryCodes",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "put",
      path: "/user/tfa/recovery",
    },
    "PATCH /user": {
      body: [
        {
          key: "email",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "language",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "name",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "password",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "phone",
          value: {
            data: "",
            type: "text",
          },
        },
        {
          key: "tfa",
          value: {
            data: false,
            type: "boolean",
          },
        },
      ],
      docs: "#api-User-ChangeYourself",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{authToken}}",
        },
      ],
      method: "patch",
      path: "/user",
    },
  },
  Utils: {
    "GET /utils/ping": {
      docs: "#api-Utils-Ping",
      method: "get",
      path: "/utils/ping",
    },
    "GET /utils/limits": {
      docs: "#api-Utils-GetLimits",
      method: "get",
      path: "/utils/limits",
    },
    "GET /utils/password/reset": {
      docs: "#api-Utils-SendPasswordResetEmail",
      method: "get",
      path: "/utils/password/reset",
      query: [
        {
          enabled: true,
          key: "email",
          value: "",
        },
      ],
      recaptcha: true,
    },
    "POST /utils/password/reset": {
      body: [
        {
          key: "password",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Utils-ResetPassword",
      headers: [
        {
          enabled: true,
          key: "Authorization",
          value: "Bearer {{emailToken}}",
        },
      ],
      method: "post",
      path: "/utils/password/reset",
    },
    "POST /utils/password/check": {
      body: [
        {
          key: "password",
          value: {
            data: "",
            type: "text",
          },
        },
      ],
      docs: "#api-Utils-CheckPassword",
      method: "post",
      path: "/utils/password/check",
    },
  },
};

export default requesterPresets;
