import Router from "express-promise-router";

import $postRoot from "./root-post";
import $putRoot from "./root-put";

const router = Router();
export default router;

router.post("/", $postRoot);
router.put("/", $putRoot);
