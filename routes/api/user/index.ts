import {Router} from "express";

import {Auth} from "src";

const router = Router();
export default router;

router.use(Auth.auth);

import tfa from "./tfa/index";

import root from "./root";

router.use("/tfa", tfa);
router.use("/", root);
