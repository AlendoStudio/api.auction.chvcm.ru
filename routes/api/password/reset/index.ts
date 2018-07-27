import {Router} from "express";

const router = Router();
export default router;

import email from "./email";
import root from "./root";

router.use("/email", email);
router.use("/", root);
