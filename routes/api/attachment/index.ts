import {Router} from "express";

import {Auth} from "src";

const router = Router();
export default router;

router.use(Auth.auth);

import root from "./root";

router.use("/", root);
