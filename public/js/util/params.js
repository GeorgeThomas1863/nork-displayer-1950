import { adminState } from "./state.js";

export const getAdminCommandParams = async () => {
  const params = {
    site: document.getElementById("admin-target-type").value,
    command: document.getElementById("admin-command-type").value,
    howMuch: document.getElementById("admin-how-much").value,
    scrapeURL: document.getElementById("admin-url-input").value,
    scrapeId: adminState.scrapeId,
  };

  return params;
};
