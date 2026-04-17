import path from "path";

// export const requireAuth = (req, res, next) => {
//   if (req.session.authenticated) return next();
//   if (req.method !== "GET") return res.status(401).json({ error: "Unauthorized" });
//   res.sendFile(path.join(process.cwd(), "html", "auth.html"));
// };

// export const requireAdminAuth = (req, res, next) => {
//   if (!req.session.authenticated) {
//     if (req.method !== "GET") return res.status(401).json({ error: "Unauthorized" });
//     res.sendFile(path.join(process.cwd(), "html", "auth.html"));
//     return;
//   }
//   if (req.session.adminAuthenticated) return next();
//   if (req.method !== "GET") return res.status(401).json({ error: "Unauthorized" });
//   res.sendFile(path.join(process.cwd(), "html", "admin-auth.html"));
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
