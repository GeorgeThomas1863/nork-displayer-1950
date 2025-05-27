import { hideArray, unhideArray } from "./util.js";
import { getBackendData, buildBackendDislay } from "./parse/parse-backend.js";
import { buildDropDown } from "./parse/parse-drop-down.js";
import { buildInputForms } from "./parse/parse-forms.js";

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
  //get elements
  const articleArrayElement = document.getElementById("article-array-element");
  const picArrayElement = document.getElementById("pic-array-element");
  const vidArrayElement = document.getElementById("vid-array-element");

  switch (dataType) {
    case "article":
      await hideArray([picArrayElement, vidArrayElement]);
      await unhideArray([articleArrayElement]);
      break;

    case "pic":
      await hideArray([articleArrayElement, vidArrayElement]);
      await unhideArray([picArrayElement]);
      break;

    case "vid":
      await hideArray([articleArrayElement, picArrayElement]);
      await unhideArray([vidArrayElement]);
      break;

    default:
      console.log("INPUT FUCKED");
      return null;
  }
};

buildDefaultDisplay();
