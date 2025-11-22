import stateFront from "./state-front.js";

export const getAuthParams = async () => {
  const authPwInput = document.getElementById("auth-pw-input");

  try {
    const params = {
      //REMOVE PLACEHOLDER BELOW
      pw: authPwInput.value || authPwInput.placeholder,
    };

    return params;
  } catch (e) {
    // console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const getAdminAuthParams = async () => {
  const adminAuthPwInput = document.getElementById("admin-auth-pw-input");

  try {
    const params = {
      //REMOVE PLACEHOLDER BELOW
      pwAdmin: adminAuthPwInput.value || adminAuthPwInput.placeholder,
    };

    return params;
  } catch (e) {
    // console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const getAdminCommandParams = async () => {
  try {
    const params = {
      site: document.getElementById("admin-target-type").value,
      command: document.getElementById("admin-command-type").value,
      howMuch: document.getElementById("admin-how-much").value,
      scrapeURL: document.getElementById("admin-url-input").value,
      scrapeId: stateFront.scrapeId,
    };

    return params;
  } catch (e) {
    // console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};
