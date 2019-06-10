import {celebrate} from "celebrate";
import Router from "express-promise-router";

import {Joi} from "src";

import $deleteRoot from "./root-delete";
import $getRoot from "./root-get";
import $putRoot from "./root-put";

const router = Router({
  mergeParams: true,
});
export default router;

router.use(
  celebrate({
    params: Joi.object({
      name: Joi.attachmentName().required(),
    }).append({
      id: Joi.any().required(),
    }),
  }),
);

router.delete("/", $deleteRoot);
router.get("/", $getRoot);
router.put("/", $putRoot);
