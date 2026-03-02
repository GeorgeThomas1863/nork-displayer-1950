import express from "express";

import { requireAuth, requireAdminAuth } from "./auth.js";
import { authController, adminAuthController } from "../controllers/auth-controller.js";
import { mainDisplay, adminDisplay, display404, display500, display401 } from "../controllers/display-controller.js";
import { updateDisplayDataController, adminCommandController, adminDataController, adminPollingController } from "../controllers/data-controller.js"; //prettier-ignore

const router = express.Router();

// Login AUTH route
router.post("/site-auth-route", authController);
router.post("/nork-admin-auth-route", adminAuthController);
router.get("/401", display401);

//-----------------------------

router.post("/nork-update-display-data-route", requireAuth, updateDisplayDataController);

//-----------------------------

router.post("/nork-admin-data-route", requireAdminAuth, adminDataController);

//send data to scraper
router.post("/nork-admin-command-route", requireAdminAuth, adminCommandController);

//poll backend
router.post("/nork-admin-polling-route", requireAdminAuth, adminPollingController);

router.use("/admin", requireAdminAuth, adminDisplay);

router.get("/", requireAuth, mainDisplay);

router.use(display404);

router.use(display500);

export default router;
