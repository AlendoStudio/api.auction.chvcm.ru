import Router from "express-promise-router";

const router = Router();
export default router;

import $postOtp from "./otp-post";
import $putOtp from "./otp-put";
import $putRecovery from "./recovery-put";

router.post("/otp", $postOtp);
router.put("/otp", $putOtp);
router.put("/recovery", $putRecovery);
