import { buildAdminForm } from "./admin/admin-form.js";
import { buildAdminReturnDisplay } from "./admin/admin-return.js";
import { buildAdminStatusDisplay } from "./admin/admin-status.js";
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

  const sidebarSub = document.createElement("div");
  sidebarSub.className = "admin-sidebar-sub";
  sidebarSub.textContent = "Scraper Control";

  sidebar.append(sidebarTitle, sidebarSub);

  const adminFormData = buildAdminForm();
  sidebar.append(adminFormData);

  const mainContent = document.createElement("div");
  mainContent.id = "admin-main-content";

  adminDisplayElement.append(sidebar, mainContent);

  await updateAdminDisplay();
  await buildAdminStatusDisplay(null);

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
