import { EYE_CLOSED_SVG } from "../util/define-things.js";

export const buildAuthMainForm = async () => {
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
  authPwLabel.textContent = "Welcome to the Nork Tracker 5000";

  const authPwWrapper = document.createElement("div");
  authPwWrapper.className = "password-input-wrapper";

  const authPwInput = document.createElement("input");
  authPwInput.type = "password";
  authPwInput.name = "auth-pw-input";
  authPwInput.id = "auth-pw-input";
  authPwInput.className = "password-input";

  // REMOVE LATER
  authPwInput.placeholder = "Input the site password here";

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
  authButton.id = "auth-button";
  authButton.className = "btn-submit";
  authButton.textContent = "SUBMIT";
  authButton.setAttribute("data-label", "auth-submit");

  authButtonListItem.append(authButton);

  return authButtonListItem;
};

//---------------------------------

//MAKE REDUNDANT

export const buildAuthAdminForm = async () => {
  const adminAuthFormWrapper = document.createElement("ul");
  adminAuthFormWrapper.id = "admin-auth-form-wrapper";

  //build FORM list items
  const adminAuthPwListItem = await buildAdminAuthPwListItem();
  const adminAuthButtonListItem = await buildAdminAuthButtonListItem();

  adminAuthFormWrapper.append(adminAuthPwListItem, adminAuthButtonListItem);

  return adminAuthFormWrapper;
};

export const buildAdminAuthPwListItem = async () => {
  const adminAuthPwListItem = document.createElement("li");
  adminAuthPwListItem.id = "admin-auth-pw-list-item";

  const adminAuthPwWrapper = document.createElement("div");
  adminAuthPwWrapper.className = "password-input-wrapper";

  const adminAuthPwInput = document.createElement("input");
  adminAuthPwInput.type = "password";
  adminAuthPwInput.name = "admin-auth-pw-input";
  adminAuthPwInput.id = "admin-auth-pw-input";
  adminAuthPwInput.className = "password-input";

  // REMOVE LATER
  adminAuthPwInput.placeholder = "Input Admin Password";

  const toggleAdminAuthPwButton = document.createElement("button");
  toggleAdminAuthPwButton.type = "button";
  toggleAdminAuthPwButton.id = "toggle-admin-auth-pw-button";
  toggleAdminAuthPwButton.className = "password-toggle-btn";
  toggleAdminAuthPwButton.setAttribute("data-label", "pwToggle");

  toggleAdminAuthPwButton.innerHTML = EYE_CLOSED_SVG;

  adminAuthPwWrapper.append(adminAuthPwInput, toggleAdminAuthPwButton);
  adminAuthPwListItem.append(adminAuthPwWrapper);

  return adminAuthPwListItem;
};

export const buildAdminAuthButtonListItem = async () => {
  const adminAuthButtonListItem = document.createElement("li");
  adminAuthButtonListItem.id = "admin-auth-button-list-item";

  const adminAuthButton = document.createElement("button");
  adminAuthButton.id = "admin-auth-button";
  adminAuthButton.className = "btn-submit";
  adminAuthButton.textContent = "SUBMIT";
  adminAuthButton.setAttribute("data-label", "admin-auth-submit");

  adminAuthButtonListItem.append(adminAuthButton);

  return adminAuthButtonListItem;
};
