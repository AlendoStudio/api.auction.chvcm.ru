import Router from "express-promise-router";

import _name from "./_name";
import $getRoot from "./root-get";

const router = Router({
  mergeParams: true,
});
export default router;

router.use("/:name", _name);
router.get("/", $getRoot);
