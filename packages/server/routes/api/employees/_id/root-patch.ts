import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";
import * as _ from "lodash";

import {
  ApiCodes,
  bodyParser,
  EmailNotifications,
  Employee,
  Joi,
  renderMarkdown,
} from "src";

const router = Router({
  mergeParams: true,
});
export default router;

/**
 * @api {patch} /employees/:id Изменить сотрудника
 * @apiVersion 1.0.0
 * @apiName ChangeEmployee
 * @apiGroup Employees
 * @apiPermission Администратор
 *
 * @apiParam {string="1..9223372036854775807"} :id ID сотрудника
 * @apiParam {string} [banMessage] Сообщение о причине блокировки в markdown (вставляется в email сообщение)
 * @apiParam {boolean} [banned] Забанен ли сотрудник?
 * @apiParam {boolean} [moderator] Есть ли права модератора?
 *
 * @apiError (Not Found 404 - Сотрудник не найден) {string="EMPLOYEE_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Not Found 404 - Сотрудник не найден) {string} message Подробное описание ошибки
 *
 * @apiUse v100CommonErrors
 * @apiUse v100AuthViaAuthToken
 * @apiUse v100AccessLevelAdmin
 */
router.use(
  bodyParser(),
  celebrate({
    body: Joi.object({
      banMessage: Joi.string(),
      banned: Joi.boolean(),
      moderator: Joi.boolean(),
    }),
  }),
  async (req, res) => {
    const employee = (await Employee.findByPk(req.params.id, {
      attributes: ["banned", "email", "language", "name"],
    })) as Employee;
    assert(employee, 404, "employee with same id not found", {
      code: ApiCodes.EMPLOYEE_NOT_FOUND_BY_ID,
    });

    if (req.body.banMessage) {
      req.body.banMessage = await renderMarkdown(req.body.banMessage);
    }

    await Employee.update(
      {
        banned: req.body.banned,
        moderator: req.body.moderator,
      },
      {
        where: {
          id: req.params.id,
        },
      },
    );

    res.status(204).send();

    if (
      !_.isUndefined(req.body.banned) &&
      req.body.banned !== employee.banned
    ) {
      if (req.body.banned) {
        await EmailNotifications.instance.banned(employee, req.body.banMessage);
      } else {
        await EmailNotifications.instance.unbanned(employee);
      }
    }
  },
);
