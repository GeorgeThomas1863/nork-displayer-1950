import { buildAuthForm } from "./forms/auth-form.js";

const adminAuthElement = document.getElementById("admin-auth-element");

export const buildAdminAuthDisplay = async () => {
  if (!adminAuthElement) return null;

  try {
    const authForm = await buildAuthForm();
    if (!authForm) {
      const error = new Error("FAILED TO BUILD AUTH FORM");
      error.function = "buildAdminAuthDisplay";
      throw error;
    }

    adminAuthElement.appendChild(authForm);
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
  }
};

buildAdminAuthDisplay();
