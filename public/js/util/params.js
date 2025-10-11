import { adminState } from "./state-front.js";

export const getAuthParams = async () => {
  const authPwInput = document.getElementById("auth-pw-input");

  try {
    if (!authPwInput) {
      const error = new Error("FAILED TO GET AUTH PW INPUT ELEMENTS IN PARAMS");
      error.function = "getAuthParams";
      throw error;
    }

    const params = {
      route: "/site-auth-route",
      //REMOVE PLACEHOLDER BELOW
      pw: authPwInput.value || authPwInput.placeholder,
    };

    return params;
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

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
