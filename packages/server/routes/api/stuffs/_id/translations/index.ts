import Router from "express-promise-router";

import _code from "./_code";
import $getRoot from "./root-get";

const router = Router({
  mergeParams: true,
});
export default router;

router.use("/:code", _code);
router.get("/", $getRoot);
