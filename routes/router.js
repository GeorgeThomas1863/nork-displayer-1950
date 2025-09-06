import express from "express";

import { mainDisplay, adminDisplay, display404, display500 } from "../controllers/display-controller.js";
import { adminDataRouteController } from "../controllers/data-controller.js";

const router = express.Router();

//admin routes
// router.post("/get-default-data-admin-route", getDefaultDataAdminRoute);
// router.get("/get-update-data-admin-route", getUpdateDataAdminRoute);

router.post("/admin-data-route", adminDataRouteController);

// router.post("/get-backend-data-route", getBackendDataRoute);

router.get("/", mainDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;
