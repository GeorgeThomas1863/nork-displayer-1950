import { getBackendData, buildBackendDislay } from "./parse/parse-backend.js";
import { buildDropDown } from "./parse/parse-drop-down.js";
import { buildInputForms } from "./parse/parse-forms.js";
import { hideArray, unhideArray } from "./util.js";
import { defineCollapseItems } from "./collapse.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
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

//------------------------------------

//RESPONSIVE STUFF

export const expandBackendData = async (dataType) => {
  //get form elements
  const articleWrapper = document.getElementById("article-wrapper");
  const picWrapper = document.getElementById("pic-wrapper");
  const vidWrapper = document.getElementById("vid-wrapper");

  //get backend data elements
  const articleArrayElement = document.getElementById("article-array-element");
  const picArrayElement = document.getElementById("pic-array-element");
  const vidArrayElement = document.getElementById("vid-array-element");

  console.log("$$$$DATA TYPE", dataType);

  switch (dataType) {
    case "article-form-header":
      await hideArray([picArrayElement, picWrapper, vidArrayElement, vidWrapper]);
      await unhideArray([articleArrayElement, articleWrapper]);
      break;

    case "pic-form-header":
      await hideArray([articleArrayElement, articleWrapper, vidArrayElement, vidWrapper]);
      await unhideArray([picArrayElement, picWrapper]);
      break;

    case "vid-form-header":
      await hideArray([articleArrayElement, articleWrapper, picArrayElement, picWrapper]);
      await unhideArray([vidArrayElement, vidWrapper]);
      break;

    default:
      console.log("INPUT FUCKED");
      return null;
  }

  return true;
};

buildDefaultDisplay();
