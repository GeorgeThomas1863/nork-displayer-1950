// // export const authController = async (req, res) => {
// //   if (!req.body || !req.body.pw) {
// //     res.json({ success: false, redirect: "/401" });
// //     return;
// //   }

// //   //pw check
// //   if (req.body.pw !== process.env.PW) {
// //     res.json({ success: false, redirect: "/401" });
// //     return;
// //   }

// //   // auth pw
// //   req.session.regenerate((err) => {
// //     if (err) return res.status(500).json({ success: false, redirect: "/401" });
// //     req.session.authenticated = true;
// //     res.json({ success: true, redirect: "/" });
// //   });
// // };

// // export const adminAuthController = async (req, res) => {
// //   if (!req.body || !req.body.pwAdmin) {
// //     res.json({ success: false, redirect: "/401" });
// //     return;
// //   }

// //   //pw check
// //   if (req.body.pwAdmin !== process.env.ADMIN_PW) {
// //     res.json({ success: false, redirect: "/401" });
// //     return;
// //   }

// //   // auth pw
// //   req.session.regenerate((err) => {
// //     if (err) return res.status(500).json({ success: false, redirect: "/401" });
// //     req.session.authenticated = true;
// //     req.session.adminAuthenticated = true;
// //     res.json({ success: true, redirect: "/admin" });
// //   });
// // };

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

//   //auth pw
//   req.session.regenerate((err) => {
//     if (err) return res.status(500).json({ success: false, redirect: "/401" });
//     req.session.authenticated = true;
//     req.session.save((err) => {
//       if (err) return res.status(500).json({ success: false, redirect: "/401" });
//       res.json({ success: true, redirect: "/" });
//     });
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
//     req.session.save((err) => {
//       if (err) return res.status(500).json({ success: false, redirect: "/401" });
//       res.json({ success: true, redirect: "/admin" });
//     });
//   });
// };

export const requireAuth = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.session.authenticated) return next();
  if (req.method !== "GET") return res.status(401).json({ error: "Unauthorized" });
  res.sendFile(path.join(process.cwd(), "html", "auth.html"));
};

export const requireAdminAuth = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  if (!req.session.authenticated) {
    if (req.method !== "GET") return res.status(401).json({ error: "Unauthorized" });
    res.sendFile(path.join(process.cwd(), "html", "auth.html"));
    return;
  }
  if (req.session.adminAuthenticated) return next();
  if (req.method !== "GET") return res.status(401).json({ error: "Unauthorized" });
  res.sendFile(path.join(process.cwd(), "html", "admin-auth.html"));
};
