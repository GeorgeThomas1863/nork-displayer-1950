import express from "express";

import { requireAuth } from "../routes/auth.js";

export const mountRequiredAuthStatic = (app, urlPrefix, dirPath, label) => {
  if (!urlPrefix || !dirPath) {
    throw new Error(`Missing required media config for ${label}: both URL prefix and filesystem path must be set`);
  }

  app.use(urlPrefix, requireAuth, express.static(dirPath));
};

export const mountAuthStatic = (app, urlPrefix, dirPath) => {
  if (!urlPrefix || !dirPath) return;

  app.use(urlPrefix, requireAuth, express.static(dirPath));
};

export const resolveListenHost = (host) => {
  return host || "127.0.0.1";
};
