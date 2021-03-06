import Router from "express-promise-router";

import {accessLevel, authViaAuthToken} from "src";

import _id from "./_id";
import $getRoot from "./root-get";
import $postRoot from "./root-post";

const router = Router();
export default router;

router.use(authViaAuthToken);
router.use(accessLevel("admin"));

router.use("/:id", _id);
router.get("/", $getRoot);
router.post("/", $postRoot);
