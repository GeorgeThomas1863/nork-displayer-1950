import { EYE_CLOSED_SVG } from "../util/define-things.js";

export const buildAuthForm = async () => {
  const authFormWrapper = document.createElement("ul");
  authFormWrapper.id = "auth-form-wrapper";

  //build FORM list items
  const authPwListItem = await buildAuthPwListItem();
  const authButtonListItem = await buildAuthButtonListItem();

  authFormWrapper.append(authPwListItem, authButtonListItem);

  return authFormWrapper;
};

export const buildAuthPwListItem = async () => {
  const authPwListItem = document.createElement("li");
  authPwListItem.id = "auth-pw-list-item";

  const authPwLabel = document.createElement("label");
  authPwLabel.id = "auth-label";
  authPwLabel.setAttribute("for", "auth-pw-input");
  authPwLabel.textContent = "AngelAI Password";

  const authPwWrapper = document.createElement("div");
  authPwWrapper.className = "password-input-wrapper";

  const authPwInput = document.createElement("input");
  authPwInput.type = "password";
  authPwInput.name = "auth-pw-input";
  authPwInput.id = "auth-pw-input";
  authPwInput.className = "password-input";

  // REMOVE LATER / ALSO REMOVE FROM PARAMS
  authPwInput.placeholder = "wellskysucks";

  const toggleAuthPwButton = document.createElement("button");
  toggleAuthPwButton.type = "button";
  toggleAuthPwButton.id = "toggle-auth-pw-button";
  toggleAuthPwButton.className = "password-toggle-btn";
  toggleAuthPwButton.setAttribute("data-label", "pwToggle");

  toggleAuthPwButton.innerHTML = EYE_CLOSED_SVG;

  authPwWrapper.append(authPwInput, toggleAuthPwButton);
  authPwListItem.append(authPwLabel, authPwWrapper);

  return authPwListItem;
};

export const buildAuthButtonListItem = async () => {
  const authButtonListItem = document.createElement("li");
  authButtonListItem.id = "auth-button-list-item";

  const authButton = document.createElement("button");
  authButton.id = "auth-submit";
  authButton.textContent = "SUBMIT";
  authButton.setAttribute("type", "auth-submit");

  authButtonListItem.append(authButton);

  return authButtonListItem;
};
