import { buildAdminForm } from "./admin/admin-form.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async () => {
  if (!adminDisplayElement) return null;

  const adminFormWrapper = await buildAdminForm();
  adminDisplayElement.appendChild(adminFormWrapper);
};

buildAdminDisplay();
