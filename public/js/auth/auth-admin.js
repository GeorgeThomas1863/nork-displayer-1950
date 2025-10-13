import { buildAdminAuthForm } from "../auth-form.js";

const adminAuthElement = document.getElementById("admin-auth-element");

export const buildAdminAuthDisplay = async () => {
  if (!adminAuthElement) return null;

  try {
    const adminAuthForm = await buildAdminAuthForm();
    if (!adminAuthForm) {
      const error = new Error("FAILED TO BUILD AUTH FORM");
      error.function = "buildAdminAuthDisplay";
      throw error;
    }

    adminAuthElement.appendChild(adminAuthForm);
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
  }
};

buildAdminAuthDisplay();
