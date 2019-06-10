import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {Joi} from "src";

import $getRoot from "./root-get";
import $patchRoot from "./root-patch";

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
);

router.get("/", $getRoot);
router.patch("/", $patchRoot);
