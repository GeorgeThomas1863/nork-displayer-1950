import CONFIG from "../middleware/config.js";

export const authController = async (req, res) => {
  if (!req.body || !req.body.pw) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  //pw check
  if (req.body.pw !== CONFIG.pw) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  // auth pw
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ success: false, redirect: "/401" });
    req.session.authenticated = true;
    res.json({ success: true, redirect: "/" });
  });
};

export const adminAuthController = async (req, res) => {
  if (!req.body || !req.body.pwAdmin) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  //pw check
  if (req.body.pwAdmin !== CONFIG.pwAdmin) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  // auth pw
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ success: false, redirect: "/401" });
    req.session.authenticated = true;
    req.session.adminAuthenticated = true;
    res.json({ success: true, redirect: "/admin" });
  });
};
