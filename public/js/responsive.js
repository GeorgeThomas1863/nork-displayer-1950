import { getAdminCommandParams } from "./util/params.js";
import { changeAdminForm } from "./forms/form-change.js";
import { sendToBack } from "./util/api-front.js";

export const adminClickHandler = async (e) => {
  e.preventDefault();

  const clickElement = e.target;
  const clickType = clickElement.getAttribute("type");

  console.log("CLICK TYPE");
  console.log(clickType);

  if (clickType !== "submit") return null;

  const adminCommandParams = await getAdminCommandParams();
  const apiOutgoingRoute = await sendToBack({ route: "/get-backend-value-route", key: "apiOutgoingRoute" });
  if (!adminCommandParams || !apiOutgoingRoute) return null;

  adminCommandParams.route = apiOutgoingRoute;
  console.log("ADMIN COMMAND PARAMS");
  console.dir(adminCommandParams);

  const data = await sendToBack(adminCommandParams);
  console.log("ADMIN COMMAND DATA");
  console.dir(data);

  //   await updateAdminStateEventTriggered(clickType);

  //   //run thing
  //   // console.log("AHHHHHHHHHHH");
  //   await buildAdminDisplay();

  //   return "DONE";
};

export const adminChangeHandler = async (e) => {
  e.preventDefault();
  const changeElement = e.target;
  const changeId = changeElement.id;

  //   console.log("CHANGE ELEMENT");
  //   console.log(changeElement);

  //   console.log("CHANGE ID");
  //   console.log(changeId);

  if (changeId !== "admin-how-much") return null;

  await changeAdminForm();

  //check if event triggered, move on if not
  // const eventTriggered = await checkChangeTriggered(changeId);
  // if (!eventTriggered) return null;

  // //update the state
  // await updateStateEventTriggered(changeId, eventTriggered);

  // //build display
  // await buildDisplay();
};

const adminDisplayElement = document.getElementById("admin-display-element");

if (adminDisplayElement) {
  adminDisplayElement.addEventListener("click", adminClickHandler);
  adminDisplayElement.addEventListener("change", adminChangeHandler);
}
