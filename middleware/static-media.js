import express from "express";

import { requireAuth } from "../routes/auth.js";

// Long-lived caching must only apply to a file express.static actually sends.
// setHeaders hooks send's 'headers' event, which fires only on a real file
// send (see node_modules/send/index.js setHeader()/sendFile()); a missing
// file falls through to the app's 404 handler untouched by this header.
const STATIC_OPTIONS = {
  setHeaders: (res) => {
    res.setHeader("Cache-Control", "private, max-age=604800, immutable");
  },
};

export const mountRequiredAuthStatic = (app, urlPrefix, dirPath, label) => {
  if (!urlPrefix || !dirPath) {
    throw new Error(`Missing required media config for ${label}: both URL prefix and filesystem path must be set`);
  }

  app.use(urlPrefix, requireAuth, express.static(dirPath, STATIC_OPTIONS));
};

export const mountAuthStatic = (app, urlPrefix, dirPath) => {
  if (!urlPrefix || !dirPath) return;

  app.use(urlPrefix, requireAuth, express.static(dirPath, STATIC_OPTIONS));
};

export const resolveListenHost = (host) => {
  return host || "127.0.0.1";
};
