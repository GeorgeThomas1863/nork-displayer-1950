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
  const articleFormElement = document.getElementById("article-wrapper");
  const picFormElement = document.getElementById("pic-wrapper");
  const vidFormElement = document.getElementById("vid-wrapper");
  const collapseArray = [articleFormElement, picFormElement, vidFormElement];

  //get backend data elements
  const articleDataElement = document.getElementById("article-array-element");
  const picDataElement = document.getElementById("pic-array-element");
  const vidDataElement = document.getElementById("vid-array-element");

  switch (dataType) {
    case "article":
      await hideArray([picDataElement, vidDataElement]);
      await unhideArray([articleDataElement]);
      break;

    case "pic":
      await hideArray([articleDataElement, vidDataElement]);
      await unhideArray([picDataElement]);
      break;

    case "vid":
      await hideArray([articleDataElement, picDataElement]);
      await unhideArray([vidDataElement]);
      break;

    default:
      console.log("INPUT FUCKED");
      return null;
  }

  await defineCollapseItems(collapseArray);

  return true;
};

buildDefaultDisplay();
