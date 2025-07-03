import express from "express";

import { indexDisplay, adminDisplay, display404, display500 } from "../controllers/display.js";
import { getAdminDefaultDataRoute, getAdminUpdateDataRoute, getBackendDataRoute } from "../controllers/data-controller.js";

const router = express.Router();

//admin routes
router.post("/get-admin-default-data-route", getAdminDefaultDataRoute);
router.get("/get-admin-update-data-route", getAdminUpdateDataRoute);

//main route handler
router.post("/get-backend-data-route", getBackendDataRoute);

router.get("/", indexDisplay);

router.use("/admin", adminDisplay);

router.use(display404);

router.use(display500);

export default router;
