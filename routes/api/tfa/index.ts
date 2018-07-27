import {Router} from "express";

import {Auth} from "src";

const router = Router();
export default router;

router.use(Auth.authPurgatory);

import authenticator from "./authenticator";
import email from "./email";
import recovery from "./recovery";

router.use("/authenticator", authenticator);
router.use("/email", email);
router.use("/recovery", recovery);
