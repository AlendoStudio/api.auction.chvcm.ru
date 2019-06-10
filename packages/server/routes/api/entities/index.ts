import Router from "express-promise-router";

import _id from "./_id";
import $getRoot from "./root-get";
import $postRoot from "./root-post";

const router = Router();
export default router;

router.use("/:id", _id);
router.get("/", $getRoot);
router.post("/", $postRoot);
