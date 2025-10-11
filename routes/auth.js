import path from "path";

export const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "html", "auth.html"));
  }
};

export const requireAdminAuth = (req, res, next) => {
  if (req.session.adminAuthenticated) {
    next();
  } else {
    res.sendFile(path.join(process.cwd(), "html", "admin-auth.html"));
  }
};
