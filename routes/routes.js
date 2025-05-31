import express from "express";

import { indexDisplay, adminDisplay, display404, display500 } from "../controllers/display.js";
import { adminSubmitRoute, getBackendDataRoute, getNewArticleDataRoute, getNewPicDataRoute, getNewVidDataRoute } from "../controllers/data-controller.js";

const router = express.Router();

router.post("/admin-submit-route", adminSubmitRoute);

router.post("/get-backend-data-route", getBackendDataRoute);

router.post("/get-new-article-data-route", getNewArticleDataRoute);

router.post("/get-new-pic-data-route", getNewPicDataRoute);

router.post("/get-new-vid-data-route", getNewVidDataRoute);

router.get("/", indexDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;
