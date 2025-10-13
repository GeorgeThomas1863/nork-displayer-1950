import { buildAuthMainForm, buildAuthAdminForm } from "./auth-form.js";

const authMainElement = document.getElementById("auth-element");
const authAdminElement = document.getElementById("admin-auth-element");

export const buildAuthMainDisplay = async () => {
  if (!authMainElement) return null;

  try {
    const authMainForm = await buildAuthMainForm();
    if (!authMainForm) {
      const error = new Error("FAILED TO BUILD AUTH FORM");
      error.function = "buildAuthMainDisplay";
      throw error;
    }

    authMainElement.appendChild(authMainForm);
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
  }
};

export const buildAuthAdminDisplay = async () => {
  if (!authAdminElement) return null;

  try {
    const authAdminForm = await buildAuthAdminForm();
    if (!authAdminForm) {
      const error = new Error("FAILED TO BUILD AUTH FORM");
      error.function = "buildAuthAdminDisplay";
      throw error;
    }

    authAdminElement.appendChild(authAdminForm);
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
  }
};

if (authMainElement) buildAuthMainDisplay();
if (authAdminElement) buildAuthAdminDisplay();
