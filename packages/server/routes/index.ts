import Router from "express-promise-router";

import {Const} from "src";

import api from "./api";

const router = Router();
export default router;

router.use(Const.API_MOUNT_POINT, api);
