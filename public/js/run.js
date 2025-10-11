import { getAuthParams, getAdminCommandParams } from "./util/params.js";
import { sendToBack } from "./util/api-front.js";

export const runAuth = async () => {
  try {
    const authParams = await getAuthParams();
    const authData = await sendToBack(authParams);
    if (!authData || !authData.redirect) return null;

    window.location.href = authData.redirect;
    return authData;
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const runAdminCommand = async () => {
  try {
    const adminCommandParams = await getAdminCommandParams();
    if (!adminCommandParams) return null;
    adminCommandParams.route = "/send-admin-command-route";

    console.log("ADMIN COMMAND PARAMS");
    console.dir(adminCommandParams);

    const data = await sendToBack(adminCommandParams);
    console.log("ADMIN COMMAND DATA");
    console.dir(data);
  } catch (e) {
    console.log("ERROR: " + e.message + "; FUNCTION: " + e.function);
    return null;
  }
};

export const runPwToggle = async () => {
  const pwButton = document.querySelector(".password-toggle-btn");
  const pwInput = document.querySelector(".password-input");

  console.log(pwButton);
  console.log(pwInput);
  const currentSvgId = pwButton.querySelector("svg").id;

  if (currentSvgId === "eye-closed-icon") {
    pwButton.innerHTML = EYE_OPEN_SVG;
    pwInput.type = "text";
  } else {
    pwButton.innerHTML = EYE_CLOSED_SVG;
    pwInput.type = "password";
  }

  return true;
};
