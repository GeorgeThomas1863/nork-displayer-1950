import { buildAdminParams, sendToBack } from "./util.js";

export const adminSubmitClick = async (e) => {
  e.preventDefault();

  //get input params
  const adminParams = await buildAdminParams();

  console.log("ADMIN PARAMS", adminParams);

  //get data
  const adminData = await sendToBack(adminParams);

  console.log("ADMIN DATA", adminData);

  //display it (remove variable name)
  // const displayData = await displayAdminReturn(adminData);
  // console.log(displayData);

  // return "DONE";
};

const adminSubmitButton = document.getElementById("admin-submit-button");
//add click listener when button exists
if (adminSubmitButton) {
  adminSubmitButton.addEventListener("click", adminSubmitClick);
}
