import express from "express";

import { indexDisplay, adminDisplay, display404, display500 } from "../controllers/display.js";
// import { adminSubmitRoute, getBackendDataRoute, getNewDataRoute, getNewArticleDataRoute, getNewPicDataRoute, getNewVidDataRoute } from "../controllers/data-controller.js";
import { adminSubmitRoute, getBackendDataRoute, getNewDataRoute } from "../controllers/data-controller.js";

const router = express.Router();

router.post("/admin-submit-route", adminSubmitRoute);

router.post("/get-backend-data-route", getBackendDataRoute);

router.post("/get-new-data-route", getNewDataRoute);

router.get("/", indexDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;
