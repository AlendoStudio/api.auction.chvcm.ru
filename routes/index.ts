import {Router} from "express";

import {Const} from "src";

const router = Router();
export default router;

import api from "./api/index";
import root from "./root";

router.use(Const.API_MOUNT_POINT, api);
router.use("/", root);
