// import stateAdmin from "./admin/admin-state.js";
import { buildAdminForm, buildAdminUpdateDataButton } from "./admin/admin-form.js";
import { buildAdminReturnDisplay } from "./admin/admin-return.js";
import { sendToBack } from "./util/api-front.js";

const adminDisplayElement = document.getElementById("admin-display-element");

//BREAK OUT INTO SEPARATE FUNCTIONS
export const buildAdminDisplay = async () => {
  if (!adminDisplayElement) return null;
  // const { isFirstLoad } = stateAdmin;

  const adminFormData = await buildAdminForm();
  adminDisplayElement.append(adminFormData);

  await updateAdminDisplay();

  return true;
};

export const updateAdminDisplay = async () => {
  if (!adminDisplayElement) return null;

  const currentAdminDataElement = document.getElementById("admin-return-container");
  if (currentAdminDataElement) currentAdminDataElement.remove();

  const adminDataRoute = await sendToBack({ route: "/get-backend-value-route", key: "adminDataRoute" });
  if (!adminDataRoute) return null;

  // const adminUpdateArray = await sendToBack({ route: adminDataRoute.value, stateAdmin: stateAdmin });
  const adminUpdateArray = await sendToBack({ route: adminDataRoute.value });
  // console.log("ADMIN UPDATE ARRAY");
  // console.dir(adminUpdateArray);

  const adminReturnDisplay = await buildAdminReturnDisplay(adminUpdateArray);
  if (!adminReturnDisplay) return null;

  adminDisplayElement.append(adminReturnDisplay);
};

buildAdminDisplay();

//--------------------------------------

// export const pollBackend = async () => {
//   const pollInterval = await sendToBack({ route: "/get-backend-value-route", key: "pollInterval" });

//   setInterval(async () => {
//     const data = await sendToBack({ route: "/polling-route" });
//     console.log("POLL DATA");
//     console.dir(data);
//     return data;
//   }, pollInterval.value);

//   console.log(`Polling started - checking every ${pollInterval.value / 1000}s`);
// };

//   const pollInterval = await sendToBack({ route: "/get-backend-value-route", key: "pollInterval" });

//   // Set up interval
//   setInterval(getPollData, pollInterval.value);
//   console.log(`Polling started - checking every ${pollInterval.value / 1000}s`);
// };

// // Main polling function
// export const getPollData = async () => {
//   // Option 1: Simple polling - always fetch all data
//   const data = await sendToBack({ route: "/polling-route" });
//   console.log("POLL DATA");
//   console.dir(data);

//   return data;
// };

//   const newDataNeededAdmin = await checkNewDataNeededAdmin();
//   if (!newDataNeededAdmin) return null;

//   const adminBackendData = await sendToBack(adminState);
//   if (!adminBackendData) return null;

//   const adminBackendDisplay = await buildAdminBackendDisplay(adminBackendData);

//   //on fail
//   if (!adminBackendDisplay) {
//     await adminDisplayFail();
//     return null;
//   }

//   adminDisplayElement.append(adminBackendDisplay);

//   await updateAdminStateDataLoaded(adminBackendData);

//   return "#DONE";

// export const adminDisplayFail = async () => {
//   const adminFailElement = document.createElement("h1");
//   adminFailElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
//   adminFailElement.id = "backend-data-fail";

//   const adminBackendDataWrapperReplace = document.getElementById("admin-backend-container");
//   if (!adminBackendDataWrapperReplace) {
//     adminDisplayElement.append(adminFailElement);
//   } else {
//     adminDisplayElement.replaceChild(adminFailElement, adminBackendDataWrapperReplace);
//   }

//   return true;
// };
