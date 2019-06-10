define({ "api": [
  {
    "type": "patch",
    "url": "/employees/:id",
    "title": "Изменить сотрудника",
    "version": "1.0.0",
    "name": "ChangeEmployee",
    "group": "Employees",
    "permission": [
      {
        "name": "Администратор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID сотрудника</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "banMessage",
            "description": "<p>Сообщение о причине блокировки в markdown (вставляется в email сообщение)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": true,
            "field": "banned",
            "description": "<p>Забанен ли сотрудник?</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": true,
            "field": "moderator",
            "description": "<p>Есть ли права модератора?</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Not Found 404 - Сотрудник не найден": [
          {
            "group": "Not Found 404 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется администратор": [
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_ADMIN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/employees/_id/root-patch.ts",
    "groupTitle": "Employees",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/employees/:id",
    "title": "Получить сотрудника",
    "version": "1.0.0",
    "name": "GetEmployee",
    "group": "Employees",
    "permission": [
      {
        "name": "Администратор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID сотрудника</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.admin",
            "description": "<p>Есть ли права администратора?</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.banned",
            "description": "<p>Забанен ли сотрудник?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID сотрудника</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.moderator",
            "description": "<p>Есть ли права модератора?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.name",
            "description": "<p>Имя</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.registration",
            "description": "<p>Дата регистрации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Not Found 404 - Сотрудник не найден": [
          {
            "group": "Not Found 404 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется администратор": [
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_ADMIN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/employees/_id/root-get.ts",
    "groupTitle": "Employees",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/employees",
    "title": "Создать нового сотрудника",
    "version": "1.0.0",
    "name": "InviteEmployee",
    "group": "Employees",
    "permission": [
      {
        "name": "Администратор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Имя</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"+79xxxxxxxxx\""
            ],
            "optional": false,
            "field": "phone",
            "description": "<p>Телефон</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "id",
            "description": "<p>ID сотрудника</p>"
          }
        ]
      }
    },
    "filename": "routes/api/employees/root-post.ts",
    "groupTitle": "Employees",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется администратор": [
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_ADMIN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Пользователь уже существует": [
          {
            "group": "Conflict 409 - Пользователь уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_EMAIL_AND_PHONE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Пользователь уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Email уже существует": [
          {
            "group": "Conflict 409 - Email уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_EMAIL\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Email уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Телефон уже существует": [
          {
            "group": "Conflict 409 - Телефон уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_PHONE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Телефон уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/employees",
    "title": "Получить список сотрудников",
    "version": "1.0.0",
    "name": "ListEmployees",
    "group": "Employees",
    "permission": [
      {
        "name": "Администратор"
      }
    ],
    "description": "<p>Результаты отсортированы по <code>name</code> в порядке возрастания</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..100\""
            ],
            "optional": true,
            "field": "limit",
            "defaultValue": "\"100\"",
            "description": "<p>Лимит</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": true,
            "field": "offset",
            "defaultValue": "\"0\"",
            "description": "<p>Оффсет</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.admin",
            "description": "<p>Есть ли права администратора?</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.banned",
            "description": "<p>Забанен ли сотрудник?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID сотрудника</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.moderator",
            "description": "<p>Есть ли права модератора?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.name",
            "description": "<p>Имя</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.registration",
            "description": "<p>Дата регистрации</p>"
          }
        ]
      }
    },
    "filename": "routes/api/employees/root-get.ts",
    "groupTitle": "Employees",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется администратор": [
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_ADMIN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется администратор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "patch",
    "url": "/entities/:id",
    "title": "Изменить юридическое лицо",
    "version": "1.0.0",
    "name": "ChangeEntity",
    "group": "Entities",
    "permission": [
      {
        "name": "Юридическое лицо или модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID юридического лица</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "banMessage",
            "description": "<p>Сообщение о причине блокировки в markdown (вставляется в email сообщение)</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": true,
            "field": "banned",
            "description": "<p>Забанено ли юридическое лицо (только для модератора)?</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "ceo",
            "description": "<p>Директор</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>Название огранизации</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": true,
            "field": "verified",
            "description": "<p>Проверено ли юридическое лицо (только для модератора)?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/_id/root-patch.ts",
    "groupTitle": "Entities",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется юридическое лицо или модератор": [
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_SAME_ENTITY_OR_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Юридическое лицо не найдено": [
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/entities/:id/attachments/:name",
    "title": "Удалить вложение",
    "version": "1.0.0",
    "name": "DeleteAttachment",
    "group": "Entities",
    "permission": [
      {
        "name": "Юридическое лицо или модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID юридического лица</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":name",
            "description": "<p>Имя вложения. Разрешенные символы: кириллица, латиница, цифры, минус, нижнее подчеркивание, пробел (не может начинаться с пробела). В конце имени обязательно должно быть хотя бы одно расширение, соостоящее из точки, латинских букв и цифр</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/_id/attachments/_name/root-delete.ts",
    "groupTitle": "Entities",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется юридическое лицо или модератор": [
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_SAME_ENTITY_OR_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Юридическое лицо не найдено": [
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/entities/:id/attachments/:name",
    "title": "Скачать вложение",
    "version": "1.0.0",
    "name": "DownloadAttachment",
    "group": "Entities",
    "permission": [
      {
        "name": "Юридическое лицо или модератор"
      }
    ],
    "description": "<p>В теле ответа будут переданы сырые байты через стрим</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID юридического лица</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":name",
            "description": "<p>Имя вложения. Разрешенные символы: кириллица, латиница, цифры, минус, нижнее подчеркивание, пробел (не может начинаться с пробела). В конце имени обязательно должно быть хотя бы одно расширение, соостоящее из точки, латинских букв и цифр</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Not Found 404 - Вложение не найдено": [
          {
            "group": "Not Found 404 - Вложение не найдено",
            "type": "string",
            "allowedValues": [
              "\"ATTACHMENT_NOT_FOUND_BY_NAME\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Вложение не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется юридическое лицо или модератор": [
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_SAME_ENTITY_OR_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Юридическое лицо не найдено": [
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/_id/attachments/_name/root-get.ts",
    "groupTitle": "Entities",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/entities/:id",
    "title": "Получить юридическое лицо",
    "version": "1.0.0",
    "name": "GetEntity",
    "group": "Entities",
    "permission": [
      {
        "name": "Юридическое лицо или модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID юридического лица</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.banned",
            "description": "<p>Забанено ли юридическое лицо?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.ceo",
            "description": "<p>Директор</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID юридического лица</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.itn",
            "description": "<p>Идентификационный номер налогоплательщика</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.name",
            "description": "<p>Название огранизации</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.psrn",
            "description": "<p>Основной государственный регистрационный номер</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.registration",
            "description": "<p>Дата регистрации</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.verified",
            "description": "<p>Проверено ли юридическое лицо?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/_id/root-get.ts",
    "groupTitle": "Entities",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется юридическое лицо или модератор": [
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_SAME_ENTITY_OR_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Юридическое лицо не найдено": [
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/entities/:id/attachments",
    "title": "Получить список вложенией",
    "version": "1.0.0",
    "name": "ListAttachments",
    "group": "Entities",
    "permission": [
      {
        "name": "Юридическое лицо или модератор"
      }
    ],
    "description": "<p>Результаты отсортированы по имени вложения в порядке возрастания (сортировка производится путем сравнения названий как массива байт в кодировке UTF-8)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID юридического лица</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..1000\""
            ],
            "optional": true,
            "field": "limit",
            "defaultValue": "\"1000\"",
            "description": "<p>Лимит</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "offset",
            "description": "<p>Оффсет</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "attachments.name",
            "description": "<p>Имя вложения</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "attachments.size",
            "description": "<p>Размер вложения в байтах</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "meta",
            "description": "<p>Метаданные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "meta.nextOffset",
            "description": "<p>Значение следующего <code>offset</code> (может быть <code>null</code>)</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/_id/attachments/root-get.ts",
    "groupTitle": "Entities",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется юридическое лицо или модератор": [
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_SAME_ENTITY_OR_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Юридическое лицо не найдено": [
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/entities",
    "title": "Получить список юридических лиц",
    "version": "1.0.0",
    "name": "ListEntities",
    "group": "Entities",
    "permission": [
      {
        "name": "Модератор"
      }
    ],
    "description": "<p>Результаты отсортированы по <code>name</code> в порядке возрастания</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..100\""
            ],
            "optional": true,
            "field": "limit",
            "defaultValue": "\"100\"",
            "description": "<p>Лимит</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": true,
            "field": "offset",
            "defaultValue": "\"0\"",
            "description": "<p>Оффсет</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.banned",
            "description": "<p>Забанено ли юридическое лицо?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.ceo",
            "description": "<p>Директор</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID юридического лица</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.itn",
            "description": "<p>Идентификационный номер налогоплательщика</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.name",
            "description": "<p>Название огранизации</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.psrn",
            "description": "<p>Основной государственный регистрационный номер</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.registration",
            "description": "<p>Дата регистрации</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.verified",
            "description": "<p>Проверено ли юридическое лицо?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/root-get.ts",
    "groupTitle": "Entities",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется модератор": [
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/entities",
    "title": "Создать новое юридическое лицо",
    "version": "1.0.0",
    "name": "SignUp",
    "group": "Entities",
    "permission": [
      {
        "name": "Гость"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "g-recaptcha-response",
            "description": "<p>Токен reCaptcha v2</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "ceo",
            "description": "<p>Директор</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "itn",
            "description": "<p>Идентификационный номер налогоплательщика</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Название огранизации</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>Пароль (учитываются только первые 72 символа)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"+79xxxxxxxxx\""
            ],
            "optional": false,
            "field": "phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "psrn",
            "description": "<p>Основной государственный регистрационный номер</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Токен авторизации</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/root-post.ts",
    "groupTitle": "Entities",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - reCaptcha v2 запретила доступ": [
          {
            "group": "Unauthorized 401 - reCaptcha v2 запретила доступ",
            "type": "string",
            "allowedValues": [
              "\"RECAPTCHA_V2\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - reCaptcha v2 запретила доступ",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Пользователь уже существует": [
          {
            "group": "Conflict 409 - Пользователь уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_EMAIL_AND_PHONE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Пользователь уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Email уже существует": [
          {
            "group": "Conflict 409 - Email уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_EMAIL\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Email уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Телефон уже существует": [
          {
            "group": "Conflict 409 - Телефон уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_PHONE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Телефон уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Юридическое лицо уже существует": [
          {
            "group": "Conflict 409 - Юридическое лицо уже существует",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_FOUND_BY_ITN_AND_PSRN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Юридическое лицо уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - ИНН уже существует": [
          {
            "group": "Conflict 409 - ИНН уже существует",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_FOUND_BY_ITN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - ИНН уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - ОГРН уже существует": [
          {
            "group": "Conflict 409 - ОГРН уже существует",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_FOUND_BY_PSRN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - ОГРН уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "/entities/:id/attachments/:name",
    "title": "Загрузить вложение",
    "version": "1.0.0",
    "name": "UploadAttachment",
    "group": "Entities",
    "permission": [
      {
        "name": "Юридическое лицо или модератор"
      }
    ],
    "description": "<p>В теле запроса должны быть переданы сырые байты</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID юридического лица</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": ":name",
            "description": "<p>Имя вложения. Разрешенные символы: кириллица, латиница, цифры, минус, нижнее подчеркивание, пробел (не может начинаться с пробела). В конце имени обязательно должно быть хотя бы одно расширение, соостоящее из точки, латинских букв и цифр</p>"
          }
        ]
      }
    },
    "filename": "routes/api/entities/_id/attachments/_name/root-put.ts",
    "groupTitle": "Entities",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется юридическое лицо или модератор": [
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_SAME_ENTITY_OR_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется юридическое лицо или модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Юридическое лицо не найдено": [
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "patch",
    "url": "/lots/:id",
    "title": "Изменить лот",
    "version": "1.0.0",
    "name": "ChangeLot",
    "group": "Lots",
    "permission": [
      {
        "name": "Проверенное юридическое лицо"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID лота</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": true,
            "field": "winnerBid",
            "description": "<p>Ставка победителя &gt;= 0</p>"
          }
        ]
      }
    },
    "filename": "routes/api/lots/_id/root-patch.ts",
    "groupTitle": "Lots",
    "success": {
      "fields": {
        "Socket \"lot\"": [
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "amount",
            "description": "<p>Количество материала &gt; 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "object",
            "optional": false,
            "field": "buffer",
            "description": "<p>Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.years",
            "description": "<p>Годы &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.months",
            "description": "<p>Месяцы &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.days",
            "description": "<p>Дни &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.hours",
            "description": "<p>Часы &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.minutes",
            "description": "<p>Минуты &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.seconds",
            "description": "<p>Секунды &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.milliseconds",
            "description": "<p>Миллисекунды &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"ISO 4217:2015 в нижнем регистре\""
            ],
            "optional": false,
            "field": "currency",
            "description": "<p>Валюта</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "finish",
            "description": "<p>Время окончания аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "id",
            "description": "<p>ID лота</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": false,
            "field": "participants",
            "description": "<p>Число участников</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "start",
            "description": "<p>Время начала аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "startBid",
            "description": "<p>Начальная ставка &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "step",
            "description": "<p>Шаг аукциона &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "boolean",
            "optional": false,
            "field": "strict",
            "description": "<p>Автовычисление ставки</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "stuffId",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"purchase\"",
              "\"sale\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Тип аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "winnerBid",
            "description": "<p>Ставка победителя &gt;= 0 (может быть <code>null</code>)</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "winnerId",
            "description": "<p>ID победителя (может быть <code>null</code>)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется проверенное юридическое лицо": [
          {
            "group": "Forbidden 403 - Требуется проверенное юридическое лицо",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_VERIFIED_ENTITY\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется проверенное юридическое лицо",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/lots",
    "title": "Создать новый лот",
    "version": "1.0.0",
    "name": "CreateLot",
    "group": "Lots",
    "permission": [
      {
        "name": "Модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "amount",
            "description": "<p>Количество материала &gt; 0</p>"
          },
          {
            "group": "Parameter",
            "type": "object",
            "optional": false,
            "field": "buffer",
            "description": "<p>Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "buffer.years",
            "description": "<p>Годы &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "buffer.months",
            "description": "<p>Месяцы &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "buffer.days",
            "description": "<p>Дни &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "buffer.hours",
            "description": "<p>Часы &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "buffer.minutes",
            "description": "<p>Минуты &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "buffer.seconds",
            "description": "<p>Секунды &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "number",
            "optional": true,
            "field": "buffer.milliseconds",
            "description": "<p>Миллисекунды &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 4217:2015 в нижнем регистре\""
            ],
            "optional": false,
            "field": "currency",
            "description": "<p>Валюта</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "finish",
            "description": "<p>Время окончания аукциона (не может быть раньше времени начала)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "start",
            "description": "<p>Время начала аукциона (не может быть в прошлом)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "startBid",
            "description": "<p>Начальная ставка &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "step",
            "description": "<p>Шаг аукциона &gt;= 0</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": false,
            "field": "strict",
            "description": "<p>Автовычисление ставки</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "stuffId",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"purchase\"",
              "\"sale\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Тип аукциона</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "id",
            "description": "<p>ID лота</p>"
          }
        ],
        "Socket \"lot\"": [
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "amount",
            "description": "<p>Количество материала &gt; 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "object",
            "optional": false,
            "field": "buffer",
            "description": "<p>Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.years",
            "description": "<p>Годы &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.months",
            "description": "<p>Месяцы &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.days",
            "description": "<p>Дни &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.hours",
            "description": "<p>Часы &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.minutes",
            "description": "<p>Минуты &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.seconds",
            "description": "<p>Секунды &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "number",
            "optional": true,
            "field": "buffer.milliseconds",
            "description": "<p>Миллисекунды &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"ISO 4217:2015 в нижнем регистре\""
            ],
            "optional": false,
            "field": "currency",
            "description": "<p>Валюта</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "finish",
            "description": "<p>Время окончания аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "id",
            "description": "<p>ID лота</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": false,
            "field": "participants",
            "description": "<p>Число участников</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "start",
            "description": "<p>Время начала аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "startBid",
            "description": "<p>Начальная ставка &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "step",
            "description": "<p>Шаг аукциона &gt;= 0</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "boolean",
            "optional": false,
            "field": "strict",
            "description": "<p>Автовычисление ставки</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "stuffId",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"purchase\"",
              "\"sale\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Тип аукциона</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "winnerBid",
            "description": "<p>Ставка победителя &gt;= 0 (может быть <code>null</code>)</p>"
          },
          {
            "group": "Socket \"lot\"",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "winnerId",
            "description": "<p>ID победителя (может быть <code>null</code>)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Not Found 404 - Материал не найден": [
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется модератор": [
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/lots/root-post.ts",
    "groupTitle": "Lots",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/lots/:id",
    "title": "Получить лот",
    "version": "1.0.0",
    "name": "GetLot",
    "group": "Lots",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID лота</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.amount",
            "description": "<p>Количество материала &gt; 0</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data.buffer",
            "description": "<p>Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.years",
            "description": "<p>Годы &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.months",
            "description": "<p>Месяцы &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.days",
            "description": "<p>Дни &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.hours",
            "description": "<p>Часы &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.minutes",
            "description": "<p>Минуты &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.seconds",
            "description": "<p>Секунды &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.milliseconds",
            "description": "<p>Миллисекунды &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 4217:2015 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.currency",
            "description": "<p>Валюта</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.finish",
            "description": "<p>Время окончания аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID лота</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.participants",
            "description": "<p>Число участников</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.start",
            "description": "<p>Время начала аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.startBid",
            "description": "<p>Начальная ставка &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.step",
            "description": "<p>Шаг аукциона &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.strict",
            "description": "<p>Автовычисление ставки</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.stuffId",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"purchase\"",
              "\"sale\""
            ],
            "optional": false,
            "field": "data.type",
            "description": "<p>Тип аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.winnerBid",
            "description": "<p>Ставка победителя &gt;= 0 (может быть <code>null</code>)</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.winnerId",
            "description": "<p>ID победителя (может быть <code>null</code>)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Not Found 404 - Лот не найден": [
          {
            "group": "Not Found 404 - Лот не найден",
            "type": "string",
            "allowedValues": [
              "\"LOT_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Лот не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/lots/_id/root-get.ts",
    "groupTitle": "Lots",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/lots",
    "title": "Получить список лотов",
    "version": "1.0.0",
    "name": "ListLots",
    "group": "Lots",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "description": "<p>Результаты отсортированы по дате начала аукциона в порядке убывания</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..100\""
            ],
            "optional": true,
            "field": "limit",
            "defaultValue": "\"100\"",
            "description": "<p>Лимит</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": true,
            "field": "offset",
            "defaultValue": "\"0\"",
            "description": "<p>Оффсет</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.amount",
            "description": "<p>Количество материала &gt; 0</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data.buffer",
            "description": "<p>Интервал времени, который всегда должен оставаться между временем последней ставки и временем окончания аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.years",
            "description": "<p>Годы &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.months",
            "description": "<p>Месяцы &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.days",
            "description": "<p>Дни &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.hours",
            "description": "<p>Часы &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.minutes",
            "description": "<p>Минуты &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.seconds",
            "description": "<p>Секунды &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": true,
            "field": "data.buffer.milliseconds",
            "description": "<p>Миллисекунды &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 4217:2015 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.currency",
            "description": "<p>Валюта</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.finish",
            "description": "<p>Время окончания аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID лота</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.participants",
            "description": "<p>Число участников</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "data.start",
            "description": "<p>Время начала аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.startBid",
            "description": "<p>Начальная ставка &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.step",
            "description": "<p>Шаг аукциона &gt;= 0</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.strict",
            "description": "<p>Автовычисление ставки</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.stuffId",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"purchase\"",
              "\"sale\""
            ],
            "optional": false,
            "field": "data.type",
            "description": "<p>Тип аукциона</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"до 131072 разрядов перед десятичной точкой; до 16383 разрядов после десятичной точки\""
            ],
            "optional": false,
            "field": "data.winnerBid",
            "description": "<p>Ставка победителя &gt;= 0 (может быть <code>null</code>)</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.winnerId",
            "description": "<p>ID победителя (может быть <code>null</code>)</p>"
          }
        ]
      }
    },
    "filename": "routes/api/lots/root-get.ts",
    "groupTitle": "Lots",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/signin",
    "title": "Вход в систему или начать двухэтапную аутентификацию",
    "version": "1.0.0",
    "name": "SignIn",
    "group": "SignIn",
    "permission": [
      {
        "name": "Гость"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "g-recaptcha-response",
            "description": "<p>Токен reCaptcha v2</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>Пароль (учитываются только первые 72 символа)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200 - При включенной двухэтапной аутентификации": [
          {
            "group": "Success 200 - При включенной двухэтапной аутентификации",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "expires",
            "description": "<p>Дата, когда временный токен аутентификации перестанет действовать</p>"
          },
          {
            "group": "Success 200 - При включенной двухэтапной аутентификации",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": false,
            "field": "tfa",
            "description": "<p>Включена ли двухэтапная аутентификация?</p>"
          },
          {
            "group": "Success 200 - При включенной двухэтапной аутентификации",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Временный токен авторизации</p>"
          }
        ],
        "Success 200 - При выключенной двухэтапной аутентификации": [
          {
            "group": "Success 200 - При выключенной двухэтапной аутентификации",
            "type": "boolean",
            "allowedValues": [
              "false"
            ],
            "optional": false,
            "field": "tfa",
            "description": "<p>Включена ли двухэтапная аутентификация?</p>"
          },
          {
            "group": "Success 200 - При выключенной двухэтапной аутентификации",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401 - Пользователь не найден": [
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "allowedValues": [
              "\"USER_NOT_FOUND_BY_EMAIL_AND_PASSWORD\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - reCaptcha v2 запретила доступ": [
          {
            "group": "Unauthorized 401 - reCaptcha v2 запретила доступ",
            "type": "string",
            "allowedValues": [
              "\"RECAPTCHA_V2\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - reCaptcha v2 запретила доступ",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/signin/root-post.ts",
    "groupTitle": "SignIn"
  },
  {
    "type": "put",
    "url": "/signin",
    "title": "Завершить двухэтапную аутентификацию",
    "version": "1.0.0",
    "name": "SignInWithTFA",
    "group": "SignIn",
    "permission": [
      {
        "name": "Временный пользователь"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Токен</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"otp\"",
              "\"recovery\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Тип токена</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "tfa",
            "description": "<p>Включена ли двухэтапная аутентификация?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Токен авторизации</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401 - Токен не прошел проверку": [
          {
            "group": "Unauthorized 401 - Токен не прошел проверку",
            "type": "string",
            "allowedValues": [
              "\"WRONG_OTP_TOKEN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Токен не прошел проверку",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Код восстановления не найден": [
          {
            "group": "Unauthorized 401 - Код восстановления не найден",
            "type": "string",
            "allowedValues": [
              "\"RECOVERY_CODE_NOT_FOUND\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Код восстановления не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь не найден": [
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "allowedValues": [
              "\"USER_NOT_FOUND_BY_PURGATORY_TOKEN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/signin/root-put.ts",
    "groupTitle": "SignIn",
    "header": {
      "fields": {
        "Authorization Header": [
          {
            "group": "Authorization Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> временный токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "patch",
    "url": "/stuffs/:id",
    "title": "Изменить материал",
    "version": "1.0.0",
    "name": "ChangeStuff",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"kg\"",
              "\"piece\""
            ],
            "optional": true,
            "field": "amountType",
            "description": "<p>Единица измерения</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": true,
            "field": "enabled",
            "description": "<p>Включен ли материал?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/_id/root-patch.ts",
    "groupTitle": "Stuffs",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется модератор": [
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Материал не найден": [
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/stuffs",
    "title": "Создать новый материал",
    "version": "1.0.0",
    "name": "CreateStuff",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"kg\"",
              "\"piece\""
            ],
            "optional": false,
            "field": "amountType",
            "description": "<p>Единица измерения</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Created 201": [
          {
            "group": "Created 201",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "id",
            "description": "<p>ID материала</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/root-post.ts",
    "groupTitle": "Stuffs",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется модератор": [
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "delete",
    "url": "/stuffs/:id/translations/:code",
    "title": "Удалить перевод",
    "version": "1.0.0",
    "name": "DeleteTranslation",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": ":code",
            "description": "<p>Язык перевода</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/_id/translations/_code/root-delete.ts",
    "groupTitle": "Stuffs",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется модератор": [
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Материал не найден": [
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/stuffs/:id",
    "title": "Получить материал",
    "version": "1.0.0",
    "name": "GetStuff",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID материала</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"kg\"",
              "\"piece\""
            ],
            "optional": false,
            "field": "data.amountType",
            "description": "<p>Единица измерения</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.enabled",
            "description": "<p>Включен ли материал?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID материала</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/_id/root-get.ts",
    "groupTitle": "Stuffs",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Материал не найден": [
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/stuffs/:id/translations/:code",
    "title": "Получить перевод",
    "version": "1.0.0",
    "name": "GetTranslation",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": ":code",
            "description": "<p>Язык перевода</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.code",
            "description": "<p>Язык перевода</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.title",
            "description": "<p>Название материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.description",
            "description": "<p>Описание материала (может быть пустым)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Not Found 404 - Перевод не найден": [
          {
            "group": "Not Found 404 - Перевод не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_TRANSLATION_NOT_FOUND_BY_CODE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Перевод не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Материал не найден": [
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/_id/translations/_code/root-get.ts",
    "groupTitle": "Stuffs",
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/stuffs",
    "title": "Получить список материалов",
    "version": "1.0.0",
    "name": "ListStuffs",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "description": "<p>Результаты отсортированы в порядке возрастания ID материала</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..100\""
            ],
            "optional": true,
            "field": "limit",
            "defaultValue": "\"100\"",
            "description": "<p>Лимит</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"0..9223372036854775807\""
            ],
            "optional": true,
            "field": "offset",
            "defaultValue": "\"0\"",
            "description": "<p>Оффсет</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"kg\"",
              "\"piece\""
            ],
            "optional": false,
            "field": "data.amountType",
            "description": "<p>Единица измерения</p>"
          },
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "data.enabled",
            "description": "<p>Включен ли материал?</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "data.id",
            "description": "<p>ID материала</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/root-get.ts",
    "groupTitle": "Stuffs",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/stuffs/:id/translations",
    "title": "Получить список переводов",
    "version": "1.0.0",
    "name": "ListTranslations",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "description": "<p>Результаты отсортированы в порядке возрастания языка перевода</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID материала</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Данные</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "data.code",
            "description": "<p>Язык перевода</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.title",
            "description": "<p>Название материала</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "optional": false,
            "field": "data.description",
            "description": "<p>Описание материала (может быть пустым)</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/_id/translations/root-get.ts",
    "groupTitle": "Stuffs",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Материал не найден": [
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "/stuffs/:id/translations/:code",
    "title": "Перевести материал",
    "version": "1.0.0",
    "name": "TranslateStuff",
    "group": "Stuffs",
    "permission": [
      {
        "name": "Модератор"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": ":id",
            "description": "<p>ID материала</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": ":code",
            "description": "<p>Язык перевода</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>Название материала</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "description",
            "defaultValue": "\"\"",
            "description": "<p>Описание материала (может быть пустым)</p>"
          }
        ]
      }
    },
    "filename": "routes/api/stuffs/_id/translations/_code/root-put.ts",
    "groupTitle": "Stuffs",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Forbidden 403 - Требуется модератор": [
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "allowedValues": [
              "\"REQUIRED_MODERATOR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Forbidden 403 - Требуется модератор",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Not Found 404 - Материал не найден": [
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "allowedValues": [
              "\"STUFF_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Not Found 404 - Материал не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "patch",
    "url": "/user",
    "title": "Изменить самого себя",
    "version": "1.0.0",
    "name": "ChangeYourself",
    "group": "User",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "description": "<blockquote> <p>Хочешь изменить мир - начни с себя</p> </blockquote>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": true,
            "field": "language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "name",
            "description": "<p>Имя (только для сотрудников)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "password",
            "description": "<p>Пароль (учитываются только первые 72 символа)</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"+79xxxxxxxxx\""
            ],
            "optional": true,
            "field": "phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Parameter",
            "type": "boolean",
            "optional": true,
            "field": "tfa",
            "description": "<p>Включена ли двухэтапная аутентификация?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user/root-patch.ts",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Пользователь уже существует": [
          {
            "group": "Conflict 409 - Пользователь уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_EMAIL_AND_PHONE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Пользователь уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Email уже существует": [
          {
            "group": "Conflict 409 - Email уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_EMAIL\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Email уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Conflict 409 - Телефон уже существует": [
          {
            "group": "Conflict 409 - Телефон уже существует",
            "type": "string",
            "allowedValues": [
              "\"USER_FOUND_BY_PHONE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Conflict 409 - Телефон уже существует",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/user/tfa/otp",
    "title": "Проверить одноразовый пароль",
    "version": "1.0.0",
    "name": "CheckOTP",
    "group": "User",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "token",
            "description": "<p>Токен</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "optional": false,
            "field": "result",
            "description": "<p>Пройден ли тест?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user/tfa/otp-post.ts",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "/user/tfa/otp",
    "title": "Сгенерировать новый секрет одноразового пароля",
    "version": "1.0.0",
    "name": "GenerateOTP",
    "group": "User",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "allowedValues": [
              "\"authenticator\""
            ],
            "optional": true,
            "field": "type",
            "defaultValue": "\"authenticator\"",
            "description": "<p>Тип однаразового пароля</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200 - authenticator": [
          {
            "group": "Success 200 - authenticator",
            "type": "string",
            "optional": false,
            "field": "keyuri",
            "description": "<p>URL для генерации QR кода</p>"
          },
          {
            "group": "Success 200 - authenticator",
            "type": "string",
            "optional": false,
            "field": "secret",
            "description": "<p>Секрет одноразового пароля</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user/tfa/otp-put.ts",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "put",
    "url": "/user/tfa/recovery",
    "title": "Сгенерировать новые коды восстановления",
    "version": "1.0.0",
    "name": "GenerateRecoveryCodes",
    "group": "User",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string[]",
            "optional": false,
            "field": "tokens",
            "description": "<p>Коды восстановления (10 элементов по умолчанию)</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user/tfa/recovery-put.ts",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/user",
    "title": "Получить информацию о самом себе",
    "version": "1.0.0",
    "name": "InfoAboutYourself",
    "group": "User",
    "permission": [
      {
        "name": "Пользователь"
      }
    ],
    "success": {
      "fields": {
        "Success 200 - Для сотрудника": [
          {
            "group": "Success 200 - Для сотрудника",
            "type": "boolean",
            "optional": false,
            "field": "admin",
            "description": "<p>Есть ли права администратора?</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "id",
            "description": "<p>ID</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "boolean",
            "optional": false,
            "field": "moderator",
            "description": "<p>Есть ли права модератора?</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Имя</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "registration",
            "description": "<p>Дата регистрации</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "boolean",
            "optional": false,
            "field": "tfa",
            "description": "<p>Включена ли двухэтапная аутентификация?</p>"
          },
          {
            "group": "Success 200 - Для сотрудника",
            "type": "string",
            "allowedValues": [
              "\"employee\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Тип пользователя</p>"
          }
        ],
        "Success 200 - Для юридического лица": [
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "optional": false,
            "field": "ceo",
            "description": "<p>Директор</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "allowedValues": [
              "\"1..9223372036854775807\""
            ],
            "optional": false,
            "field": "id",
            "description": "<p>ID</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "optional": false,
            "field": "itn",
            "description": "<p>Идентификационный номер налогоплательщика</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "allowedValues": [
              "\"ISO 639-1 в нижнем регистре\""
            ],
            "optional": false,
            "field": "language",
            "description": "<p>Язык</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "optional": false,
            "field": "name",
            "description": "<p>Название огранизации</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "optional": false,
            "field": "phone",
            "description": "<p>Телефон</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "optional": false,
            "field": "psrn",
            "description": "<p>Основной государственный регистрационный номер</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "registration",
            "description": "<p>Дата регистрации</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "boolean",
            "optional": false,
            "field": "tfa",
            "description": "<p>Включена ли двухэтапная аутентификация?</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "string",
            "allowedValues": [
              "\"entity\""
            ],
            "optional": false,
            "field": "type",
            "description": "<p>Тип пользователя</p>"
          },
          {
            "group": "Success 200 - Для юридического лица",
            "type": "boolean",
            "optional": false,
            "field": "verified",
            "description": "<p>Является ли учетная запись проверенной?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/user/root-get.ts",
    "groupTitle": "User",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Неверный токен авторизаци": [
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "allowedValues": [
              "\"JWT_VERIFY_USER\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Неверный токен авторизаци",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Сотрудник не найден": [
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "allowedValues": [
              "\"EMPLOYEE_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Сотрудник не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Юридическое лицо не найдено": [
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "allowedValues": [
              "\"ENTITY_NOT_FOUND_BY_ID\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Юридическое лицо не найдено",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен авторизации</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/utils/password/check",
    "title": "Проверить пароль",
    "version": "1.0.0",
    "name": "CheckPassword",
    "group": "Utils",
    "permission": [
      {
        "name": "Гость"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>Пароль (учитываются только первые 72 символа)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "score",
            "description": "<p>Рейтинг пароля</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "allowedValues": [
              "0",
              "1",
              "2",
              "3",
              "4"
            ],
            "optional": false,
            "field": "score.actual",
            "description": "<p>Текущий рейтинг пароля</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "allowedValues": [
              "1",
              "3"
            ],
            "optional": false,
            "field": "score.expected",
            "description": "<p>Минимально резрешенный рейтинг пароля</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "allowedValues": [
              "4"
            ],
            "optional": false,
            "field": "score.max",
            "description": "<p>Максимальный рейтинг пароля</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "allowedValues": [
              "0"
            ],
            "optional": false,
            "field": "score.min",
            "description": "<p>Минимальный рейтинг пароля</p>"
          }
        ]
      }
    },
    "filename": "routes/api/utils/password/check-post.ts",
    "groupTitle": "Utils",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    }
  },
  {
    "type": "get",
    "url": "/utils/limits",
    "title": "Получить лимиты сервера",
    "version": "1.0.0",
    "name": "GetLimits",
    "group": "Utils",
    "permission": [
      {
        "name": "Гость"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "body",
            "description": "<p>Максимальный размер тела запроса</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "body.json",
            "description": "<p>Для JSON (в байтах)</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "optional": false,
            "field": "body.raw",
            "description": "<p>Для файлов (в байтах)</p>"
          },
          {
            "group": "Success 200",
            "type": "object",
            "optional": false,
            "field": "select",
            "description": "<p>Лимит на лимит выборки</p>"
          },
          {
            "group": "Success 200",
            "type": "number",
            "allowedValues": [
              "1000"
            ],
            "optional": false,
            "field": "select.attachments",
            "description": "<p>Лимит на лимит выборки вложений</p>"
          },
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"100\""
            ],
            "optional": false,
            "field": "select.db",
            "description": "<p>Лимит на лимит выборки из базы данных</p>"
          }
        ]
      }
    },
    "filename": "routes/api/utils/limits-get.ts",
    "groupTitle": "Utils",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    }
  },
  {
    "type": "all",
    "url": "/utils/ping",
    "title": "Проверить доступность сервера",
    "description": "<p>А также мини игра &quot;Настольный теннис&quot;</p>",
    "version": "1.0.0",
    "name": "Ping",
    "group": "Utils",
    "permission": [
      {
        "name": "Гость"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": false,
            "field": "pong",
            "description": "<p>Отбил ли сервер мячик?</p>"
          }
        ]
      }
    },
    "filename": "routes/api/utils/ping-all.ts",
    "groupTitle": "Utils",
    "error": {
      "fields": {
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    }
  },
  {
    "type": "post",
    "url": "/utils/password/reset",
    "title": "Сбросить пароль",
    "version": "1.0.0",
    "name": "ResetPassword",
    "group": "Utils",
    "permission": [
      {
        "name": "Временный пользователь"
      }
    ],
    "header": {
      "fields": {
        "Authorization": [
          {
            "group": "Authorization",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p><strong>Bearer</strong> токен сброса пароля</p>"
          }
        ]
      }
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>Пароль (учитываются только первые 72 символа)</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401 - Пользователь не найден": [
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "allowedValues": [
              "\"USER_NOT_FOUND_BY_PASSWORD_RESET_TOKEN\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/utils/password/reset-post.ts",
    "groupTitle": "Utils"
  },
  {
    "type": "get",
    "url": "/utils/password/reset",
    "title": "Отправить на указанный email токен для сброса пароля",
    "version": "1.0.0",
    "name": "SendPasswordResetEmail",
    "group": "Utils",
    "permission": [
      {
        "name": "Гость"
      }
    ],
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "g-recaptcha-response",
            "description": "<p>Токен reCaptcha v2</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>Email</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "string",
            "allowedValues": [
              "\"ISO 8601\""
            ],
            "optional": false,
            "field": "expires",
            "description": "<p>Дата, когда токен сброса пароля перестанет действовать</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Unauthorized 401 - Пользователь не найден": [
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "allowedValues": [
              "\"USER_NOT_FOUND_BY_EMAIL\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь не найден",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - Пользователь забанен": [
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "allowedValues": [
              "\"BANNED\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - Пользователь забанен",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Bad Request 400": [
          {
            "group": "Bad Request 400",
            "type": "string",
            "allowedValues": [
              "\"BAD_REQUEST\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Bad Request 400",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Payload Too Large 413": [
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "allowedValues": [
              "\"PAYLOAD_TOO_LARGE\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Payload Too Large 413",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Internal Server Error 500": [
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "allowedValues": [
              "\"INTERNAL_SERVER_ERROR\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Internal Server Error 500",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ],
        "Unauthorized 401 - reCaptcha v2 запретила доступ": [
          {
            "group": "Unauthorized 401 - reCaptcha v2 запретила доступ",
            "type": "string",
            "allowedValues": [
              "\"RECAPTCHA_V2\""
            ],
            "optional": false,
            "field": "code",
            "description": "<p>Код ошибки</p>"
          },
          {
            "group": "Unauthorized 401 - reCaptcha v2 запретила доступ",
            "type": "string",
            "optional": false,
            "field": "message",
            "description": "<p>Подробное описание ошибки</p>"
          }
        ]
      }
    },
    "filename": "routes/api/utils/password/reset-get.ts",
    "groupTitle": "Utils"
  }
] });
