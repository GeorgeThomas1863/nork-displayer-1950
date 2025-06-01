import d from "./define-things.js";
import { buildBackendDislay } from "./build-backend.js";
import { buildDropDown } from "./build-drop-down.js";
import { buildInputForms } from "./build-forms.js";
import { hideArray, unhideArray, sendToBack, buildInputParams } from "./util.js";

//get display element
const displayElement = document.getElementById("display-element");

//DEFAULT DISPLAY
export const buildDefaultDisplay = async () => {
  if (!displayElement) return null;

  //build drop down
  const dropDownElement = await buildDropDown();

  //build input forms
  const inputFormWrapper = await buildInputForms();

  //set default return type
  const typeObj = {
    dataType: "pics",
    isFirstLoad: true,
  };

  //build data data return
  const backendDataWrapper = await buildBackendDislay(typeObj);

  displayElement.append(dropDownElement, inputFormWrapper, backendDataWrapper);

  return "#DONE";
};

//BUILD IN STATE SHIT
export const displayNewData = async (inputObj) => {
  if (!inputObj || !inputObj.dataType) return null;

  console.log("DISPLAY NEW DATA");
  console.log(inputObj);

  const { dataType } = inputObj;
  const newDataObj = inputObj[dataType];

  const backendDataWrapper = document.getElementById("backend-data-wrapper");

  const func = d.backendFunctionMap[dataType];
  const dataElement = await func(newDataObj);
  backendDataWrapper.replaceChild(dataElement, backendDataWrapper.firstElementChild);

  return true;
};

//RESPONSIVE STUFF

export const getNewData = async (inputObj) => {
  //check if new data triggered
  const newDataTrigger = await checkNewDataTrigger(inputObj);
  if (!newDataTrigger) return null;

  //get user input, combine with params
  const userInputParams = await buildInputParams();

  const paramsObj = { ...userInputParams, ...inputObj };
  paramsObj.route = "/get-new-data-route";
  const dataObj = await sendToBack(paramsObj);

  return dataObj;
};

//add in the state shit?
export const checkNewDataTrigger = async (inputObj) => {
  const { clickId, expandType, inputId } = inputObj;

  for (let i = 0; i < d.clickTriggerArr.length; i++) {
    if (clickId === d.clickTriggerArr[i]) {
      return true;
    }
  }

  for (let i = 0; i < d.expandTriggerArr.length; i++) {
    if (expandType === d.expandTriggerArr[i]) {
      return true;
    }
  }

  //MIGHT NOT BE NEEDED
  for (let i = 0; i < d.inputTriggerArr.length; i++) {
    if (inputId === d.inputTriggerArr[i]) {
      return true;
    }
  }

  return false;
};

//better version of expand backend data equation
export const expandBackendData = async (dataType) => {
  // Build typeMap using the consistent naming pattern
  const typeMap = {};
  for (let i = 0; i < d.backendTypeArr.length; i++) {
    const typeValue = d.backendTypeArr[i];
    const formHeader = `${typeValue}-form-header`;

    typeMap[formHeader] = {
      wrapperElement: () => document.getElementById(`${typeValue}-wrapper`),
      dataElement: () => document.getElementById(`${typeValue}-array-element`),
      arrowElement: () => document.querySelector(`#collapse-arrow[data-expand='${formHeader}']`),
    };
  }

  const currentTypeData = typeMap[dataType];
  if (!currentTypeData) {
    console.log("INPUT FUCKED");
    return null;
  }

  const currentArrow = currentTypeData.arrowElement();
  const isCurrentExpanded = currentArrow.classList.contains("expanded");

  // Get all form headers by looping through baseTypes
  const currentElements = [currentTypeData.wrapperElement(), currentTypeData.dataElement()];
  const otherElements = [];
  const otherArrows = [];

  for (let i = 0; i < typeArray.length; i++) {
    const typeValue = typeArray[i];
    const formHeader = `${typeValue}-form-header`;

    if (formHeader !== dataType) {
      const typeData = typeMap[formHeader];
      otherElements.push(typeData.wrapperElement());
      otherElements.push(typeData.dataElement());
      otherArrows.push(typeData.arrowElement());
    }
  }

  if (isCurrentExpanded) {
    await hideArray(otherElements);
    await unhideArray(currentElements);

    for (let i = 0; i < otherArrows.length; i++) {
      otherArrows[i].classList.remove("expanded");
    }
  } else {
    await hideArray(currentElements);
  }

  return true;
};

buildDefaultDisplay();
