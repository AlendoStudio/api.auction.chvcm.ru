import {celebrate} from "celebrate";
import Router from "express-promise-router";
import * as assert from "http-assert";

import {ApiCodes, Joi, Stuff} from "src";

import $getRoot from "./root-get";
import $pathRoot from "./root-patch";
import translations from "./translations";

const router = Router({
  mergeParams: true,
});
export default router;

router.use(
  celebrate({
    params: Joi.object({
      id: Joi.pgBigSerial().required(),
    }),
  }),
  async (req, res) => {
    assert(
      await Stuff.count({
        where: {
          id: req.params.id,
        },
      }),
      404,
      "stuff with same id not found",
      {code: ApiCodes.STUFF_NOT_FOUND_BY_ID},
    );

    return "next";
  },
);

router.use("/translations", translations);
router.get("/", $getRoot);
router.patch("/", $pathRoot);

/**
 * @apiDefine v100ApiStuffsIdErrors
 *
 * @apiError (Not Found 404 - Материал не найден) {string="STUFF_NOT_FOUND_BY_ID"} code Код ошибки
 * @apiError (Not Found 404 - Материал не найден) {string} message Подробное описание ошибки
 */
