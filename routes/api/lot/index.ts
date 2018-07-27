import {Router} from "express";

import {Auth} from "src";

const router = Router();
export default router;

import bet from "./bet";
import root from "./root";
import search from "./search";

router.use(Auth.auth);

router.use("/bet", bet);
router.use("/search", search);
router.use("/", root);
