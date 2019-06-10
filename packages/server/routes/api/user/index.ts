import Router from "express-promise-router";

import {authViaAuthToken} from "src";

import $getRoot from "./root-get";
import $patchRoot from "./root-patch";
import tfa from "./tfa";

const router = Router();
export default router;

router.use(authViaAuthToken);

router.use("/tfa", tfa);
router.get("/", $getRoot);
router.patch("/", $patchRoot);
