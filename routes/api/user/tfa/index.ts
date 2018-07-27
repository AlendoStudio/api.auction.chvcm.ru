import {Router} from "express";

const router = Router();
export default router;

import authenticator from "./authenticator";
import recovery from "./recovery";
import root from "./root";

router.use("/authenticator", authenticator);
router.use("/recovery", recovery);
router.use("/", root);
