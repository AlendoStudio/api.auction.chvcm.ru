import Router from "express-promise-router";

import $getLimits from "./limits-get";
import password from "./password";
import $allPing from "./ping-all";

const router = Router();
export default router;

router.use("/password", password);
router.get("/limits", $getLimits);
router.all("/ping", $allPing);
