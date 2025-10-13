import { runAuth, runAdminAuth, runAdminCommand, runPwToggle, runDropDownToggle, runAdminTrigger } from "./run.js";
import { changeAdminForm } from "./forms/form-change.js";

export const clickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const clickType = clickElement.getAttribute("data-label");

  console.log("CLICK ID");
  console.log(clickId);
  console.log("CLICK TYPE");
  console.log(clickType);

  switch (clickType) {
    case "auth-submit":
      await runAuth();
      break;
    case "admin-auth-submit":
      await runAdminAuth();
      break;
    case "admin-command-submit":
      await runAdminCommand();
      break;
    case "pwToggle":
      await runPwToggle();
      break;
    case "dropdown":
      await runDropDownToggle();
      break;
    case "admin-trigger":
      await runAdminTrigger();
      break;
  }

  // if (clickType === "pwToggle") await runPwToggle();
  // if (clickType === "auth-submit") await runAuth();
  // if (clickType === "admin-auth-submit") await runAdminAuth();
  // if (clickType === "admin-command-submit") await runAdminCommand();

  //   //run thing
  //   // console.log("AHHHHHHHHHHH");
  //   await buildAdminDisplay();

  //   return "DONE";
};

export const keyHandler = async (e) => {
  if (e.key !== "Enter") return null;
  e.preventDefault();

  // Determine which button to trigger based on context
  const authButton = document.getElementById("auth-button");
  const adminAuthButton = document.getElementById("admin-auth-button");

  // Check if auth button is visible and enabled (user is on auth screen)
  if (authButton && authButton.offsetParent !== null && !authButton.disabled) return await runAuth();

  if (adminAuthButton && adminAuthButton.offsetParent !== null && !adminAuthButton.disabled) return await runAdminAuth();

  //make so only submits on click
  // if (visitSubmitButton && visitSubmitButton.offsetParent !== null && !visitSubmitButton.disabled) return await runSetDataWS();

  return null;
};

export const changeHandler = async (e) => {
  e.preventDefault();
  const changeElement = e.target;
  const changeId = changeElement.id;

  //   console.log("CHANGE ELEMENT");
  //   console.log(changeElement);

  //   console.log("CHANGE ID");
  //   console.log(changeId);

  if (changeId !== "admin-how-much") return null;

  await changeAdminForm();
};

const authElement = document.getElementById("auth-element");
const adminAuthElement = document.getElementById("admin-auth-element");
const displayElement = document.getElementById("display-element");
const adminDisplayElement = document.getElementById("admin-display-element");

if (authElement) {
  authElement.addEventListener("click", clickHandler);
  authElement.addEventListener("keydown", keyHandler);
}

if (adminAuthElement) {
  adminAuthElement.addEventListener("click", clickHandler);
  adminAuthElement.addEventListener("keydown", keyHandler);
}

if (displayElement) {
  displayElement.addEventListener("click", clickHandler);
  displayElement.addEventListener("keydown", keyHandler);
}

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", clickHandler);
  adminDisplayElement.addEventListener("change", changeHandler);
}
