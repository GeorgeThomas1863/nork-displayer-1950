// export const authController = async (req, res) => {
//   if (!req.body || !req.body.pw) {
//     res.json({ success: false, redirect: "/401" });
//     return;
//   }

//   //pw check
//   if (req.body.pw !== process.env.PW) {
//     res.json({ success: false, redirect: "/401" });
//     return;
//   }

//   // auth pw
//   req.session.regenerate((err) => {
//     if (err) return res.status(500).json({ success: false, redirect: "/401" });
//     req.session.authenticated = true;
//     res.json({ success: true, redirect: "/" });
//   });
// };

// export const adminAuthController = async (req, res) => {
//   if (!req.body || !req.body.pwAdmin) {
//     res.json({ success: false, redirect: "/401" });
//     return;
//   }

//   //pw check
//   if (req.body.pwAdmin !== process.env.ADMIN_PW) {
//     res.json({ success: false, redirect: "/401" });
//     return;
//   }

//   // auth pw
//   req.session.regenerate((err) => {
//     if (err) return res.status(500).json({ success: false, redirect: "/401" });
//     req.session.authenticated = true;
//     req.session.adminAuthenticated = true;
//     res.json({ success: true, redirect: "/admin" });
//   });
// };

export const authController = async (req, res) => {
  if (!req.body || !req.body.pw) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  //pw check
  if (req.body.pw !== process.env.PW) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  //auth pw
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ success: false, redirect: "/401" });
    req.session.authenticated = true;
    req.session.save((err) => {
      if (err) return res.status(500).json({ success: false, redirect: "/401" });
      res.json({ success: true, redirect: "/" });
    });
  });
};

export const adminAuthController = async (req, res) => {
  if (!req.body || !req.body.pwAdmin) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  //pw check
  if (req.body.pwAdmin !== process.env.ADMIN_PW) {
    res.json({ success: false, redirect: "/401" });
    return;
  }

  // auth pw
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ success: false, redirect: "/401" });
    req.session.authenticated = true;
    req.session.adminAuthenticated = true;
    req.session.save((err) => {
      if (err) return res.status(500).json({ success: false, redirect: "/401" });
      res.json({ success: true, redirect: "/admin" });
    });
  });
};
