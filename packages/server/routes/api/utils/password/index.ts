import Router from "express-promise-router";

const router = Router();
export default router;

import $postCheck from "./check-post";
import $getReset from "./reset-get";
import $postReset from "./reset-post";

router.post("/check", $postCheck);
router.get("/reset", $getReset);
router.post("/reset", $postReset);
