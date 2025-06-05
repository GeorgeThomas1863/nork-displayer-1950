import d from "./define-things.js";
import { buildDropDown } from "./build-drop-down.js";
import { buildInputForms } from "./build-forms.js";
import { buildBackendDefault } from "./build-backend.js";
import { hideArray, unhideArray, sendToBack, buildInputParams, checkNewDataTrigger } from "./util.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
export const buildDisplay = async () => {
  if (!displayElement) return null;

  //build drop down
  const dropDownElement = await buildDropDown();

  //build input formss
  const inputFormWrapper = await buildInputForms();

  //set default return type
  const typeObj = {
    dataType: "pics",
    isFirstLoad: true,
  };

  //build data data return
  const backendDataWrapper = await buildBackendDefault(typeObj);

  displayElement.append(dropDownElement, inputFormWrapper, backendDataWrapper);

  return "#DONE";
};

//RESPONSIVE STUFF
export const getNewData = async (inputObj) => {
  //check if new data triggered
  console.log("GET NEW DATA CALLED");
  console.log(inputObj);

  const newDataTrigger = await checkNewDataTrigger(inputObj);
  console.log("NEW DATA TRIGGER");
  console.log(newDataTrigger);

  if (!newDataTrigger) return null;

  //get user input, combine with params
  const userInputParams = await buildInputParams();

  console.log("USER INPUT PARAMS");
  console.log(userInputParams);

  const paramsObj = { ...userInputParams, ...inputObj };
  paramsObj.route = "/get-new-data-route";
  const dataObj = await sendToBack(paramsObj);

  return dataObj;
};

//better version of expand backend data equation
export const expandBackendData = async (dataType) => {
  // Build typeMap using the consistent naming pattern
  const typeMap = {};
  for (let i = 0; i < d.expandTypeArr.length; i++) {
    const typeValue = d.expandTypeArr[i];
    const formHeader = `${typeValue}-form-header`;

    typeMap[formHeader] = {
      wrapperElement: () => document.getElementById(`${typeValue}-wrapper`),
      arrowElement: () => document.querySelector(`#collapse-arrow[data-expand='${formHeader}']`),
    };
  }

  const currentTypeData = typeMap[dataType];

  const currentArrow = currentTypeData.arrowElement();
  const isCurrentExpanded = currentArrow.classList.contains("expanded");

  // Get all form headers by looping through baseTypes
  const currentElementArray = [currentTypeData.wrapperElement()];
  const otherElementArray = [];
  const otherArrowArray = [];

  for (let i = 0; i < d.expandTypeArr.length; i++) {
    const typeValue = d.expandTypeArr[i];
    const formHeader = `${typeValue}-form-header`;

    if (formHeader !== dataType) {
      const typeData = typeMap[formHeader];
      otherElementArray.push(typeData.wrapperElement());
      otherArrowArray.push(typeData.arrowElement());
    }
  }

  if (isCurrentExpanded) {
    await hideArray(otherElementArray);
    await unhideArray(currentElementArray);

    for (let i = 0; i < otherArrowArray.length; i++) {
      otherArrowArray[i].classList.remove("expanded");
    }
  } else {
    await hideArray(currentElementArray);
  }

  return true;
};

buildDisplay();
