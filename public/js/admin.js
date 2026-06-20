// import stateAdmin from "./admin/admin-state.js";
import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminReturnDisplay } from "./admin/admin-return.js";
import { sendToBack } from "./util/api-front.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async () => {
  if (!adminDisplayElement) return null;

  const sidebar = document.createElement("div");
  sidebar.id = "admin-sidebar";

  const sidebarTitle = document.createElement("div");
  sidebarTitle.id = "admin-sidebar-title";
  sidebarTitle.textContent = "KCNA Monitor";
  sidebar.append(sidebarTitle);

  const adminFormData = await buildAdminForm();
  sidebar.append(adminFormData);

  const mainContent = document.createElement("div");
  mainContent.id = "admin-main-content";

  adminDisplayElement.append(sidebar, mainContent);

  await updateAdminDisplay();

  return true;
};

export const updateAdminDisplay = async () => {
  if (!adminDisplayElement) return null;

  const mainContent = document.getElementById("admin-main-content");
  if (!mainContent) return null;

  const currentAdminDataElement = document.getElementById("admin-return-container");
  if (currentAdminDataElement) currentAdminDataElement.remove();

  const adminUpdateArray = await sendToBack({ route: "/nork-admin-data-route" });

  const adminReturnDisplay = await buildAdminReturnDisplay(adminUpdateArray);
  if (!adminReturnDisplay) return null;

  mainContent.append(adminReturnDisplay);
};

buildAdminDisplay();
