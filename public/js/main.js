import { getBackendData, buildBackendDislay } from "./parse/parse-backend.js";
import { buildDropDown } from "./parse/parse-drop-down.js";
import { buildInputForms } from "./parse/parse-forms.js";

//get display element
const displayElement = document.getElementById("display-element");

export const buildDefaultDisplay = async () => {
  //get backend data FIRST (to check for fail )
  const backendDataObj = await getBackendData();
  if (!backendDataObj) return null;

  //build drop down
  const dropDownElement = await buildDropDown();

  //build input forms
  const inputFormWrapper = await buildInputForms();

  //build data return
  const backendDataWrapper = await buildBackendDislay(backendDataObj);

  displayElement.append(dropDownElement, inputFormWrapper, backendDataWrapper);

  return "#DONE";
};

buildDefaultDisplay();
