import { adminState } from "./state.js";

export const getAdminInputParams = async () => {
  const params = {
    route: "/admin-data-route",
    appType: document.getElementById("admin-app-type").value,
    commandType: document.getElementById("admin-command-type").value,
    howMuch: document.getElementById("admin-how-much").value,
    scrapeURL: document.getElementById("admin-url-input").value,
    scrapeId: adminState.scrapeId,
  };

  return params;
};
