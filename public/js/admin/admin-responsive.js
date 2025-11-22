import { runAdminAuth, runAdminCommand, runAdminUpdateData, runAdminToggleURL } from "./admin-run.js";
import { runPwToggle } from "../run.js";

export const clickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickId = clickElement.id;
  const clickType = clickElement.getAttribute("data-label");
  const clickUpdate = clickElement.getAttribute("data-update");

  console.log("CLICK HANDLER");
  console.log(clickElement);
  console.log("CLICK ID");
  console.log(clickId);

  console.log("CLICK DATA TYPE");
  if (clickType) console.log(clickType);
  if (clickUpdate) console.log(clickUpdate);

  if (clickType === "admin-auth-submit") await runAdminAuth();
  if (clickType === "admin-command-submit") await runAdminCommand();
  if (clickType === "admin-update-data-button") await runAdminUpdateData();
  if (clickType === "pwToggle") await runPwToggle();
};

export const keyHandler = async (e) => {
  if (e.key !== "Enter") return null;
  e.preventDefault();

  console.log("KEY HANDLER");
  console.log(e.key);

  // Determine which button to trigger based on context
  const adminAuthButton = document.getElementById("admin-auth-button");

  if (adminAuthButton && adminAuthButton.offsetParent !== null && !adminAuthButton.disabled) return await runAdminAuth();

  return null;
};

export const changeHandler = async (e) => {
  e.preventDefault();
  const changeElement = e.target;
  const changeId = changeElement.id;

  console.log("CHANGE HANDLER");
  console.log(changeElement);
  console.log(changeId);

  if (changeId !== "admin-how-much") return null;

  await runAdminToggleURL();
};

const adminAuthElement = document.getElementById("admin-auth-element");
const adminDisplayElement = document.getElementById("admin-display-element");

if (adminAuthElement) {
  adminAuthElement.addEventListener("click", clickHandler);
  adminAuthElement.addEventListener("keydown", keyHandler);
}

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", clickHandler);
  adminDisplayElement.addEventListener("change", changeHandler);
}
