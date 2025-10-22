import bcrypt from "bcrypt";

import CONFIG from "../config/config.js";

export const authController = async (req, res) => {
  if (!req.body || !req.body.pw) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  const pwValid = await bcrypt.compare(req.body.pw, CONFIG.pw);

  //pw check
  if (!pwValid) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  // auth pw
  req.session.authenticated = true;
  res.json({ success: true, redirect: "/" });
};

export const adminAuthController = async (req, res) => {
  if (!req.body || !req.body.pwAdmin) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  const pwAdminValid = await bcrypt.compare(req.body.pwAdmin, CONFIG.pwAdmin);

  //pw check
  if (!pwAdminValid) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  // auth pw
  req.session.adminAuthenticated = true;
  res.json({ success: true, redirect: "/admin" });
};
