import {Router} from "express";

const router = Router();
export default router;

router.get("/", async (req, res) => {
  await res.achain
    .render("root")
    .execute();
});
