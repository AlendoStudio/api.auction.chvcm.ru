import {Router} from "express";

const router = Router();
export default router;

import reset from "./reset/index";

import check from "./check";

router.use("/reset", reset);
router.use("/check", check);
