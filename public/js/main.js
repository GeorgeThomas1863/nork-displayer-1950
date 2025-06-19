import d from "./define-things.js";
import { buildDropDown } from "./build-drop-down.js";
import { buildInputForms } from "./build-forms.js";
// import { buildBackendDefault } from "./build-backend.js";
import { hideArray, unhideArray, sendToBack, buildInputParams, checkNewDataTrigger, buildFailElement } from "./util.js";
import { currentData, newDataTrigger } from "./state.js";

//get display element
const displayElement = document.getElementById("display-element");
const failElement = await buildFailElement();

//DEFAULT DISPLAY
export const buildDisplay = async () => {
  if (!displayElement) return null;
  const { isFirstLoad } = currentData;

  //build drop down / form on first load
  if (isFirstLoad) {
    const dropDownElement = await buildDropDown();
    const inputFormWrapper = await buildInputForms();
    displayElement.append(dropDownElement, inputFormWrapper);
  }

  //check if new data is needed [will pass on first load]
  const newDataNeeded = await newDataTrigger();
  if (!newDataNeeded) return null;

  //get / parse backend data (returns array of objects)
  const backendDataArray = await sendToBack(currentData);
  const backendDataParsed = await buildBackendDisplay(backendDataArray);
  console.log("!!!!BACKEND DATA PARSED");
  console.log(backendDataParsed);

  displayElement.append(backendDataParsed);

  //UPDATE THE STATE HERE

  return "#DONE";
};

export const buildBackendDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return failElement;
  const { isFirstLoad } = currentData;

  //build wrapper
  const backendDataWrapper = document.createElement("div");
  backendDataWrapper.id = "backend-data-wrapper";

  //only need for loop on first load (could break this part out)
  if (isFirstLoad) {
    for (let i = 0; i < inputArray.length; i++) {
      const dataObj = inputArray[i];
      const { dataType, dataArray } = dataObj;
      const func = d.displayFunctionMap[dataType];
      const dataElement = await func(dataArray);
      console.log(dataElement.id);
      if (dataElement.id === "pic-array-element") {
        console.log("AHHHHHHHH");
      }
      backendDataWrapper.append(dataElement);
    }

    //hide everything but pics for default
  }

  if (!backendDataWrapper) return failElement;

  return backendDataWrapper;
};
//RESPONSIVE STUFF
// export const getNewData = async (inputObj) => {
//   //checks if command triggered, if so gets type of command triggered
//   const commandTriggerType = await checkNewDataTrigger(inputObj);

//   if (!commandTriggerType) return null;

//   //get user input
//   const userInputParams = await buildInputParams();

//   //build params
//   const paramsObj = { ...userInputParams, ...inputObj };
//   paramsObj.route = "/get-new-data-route";
//   paramsObj.commandType = commandTriggerType;

//   const dataObj = await sendToBack(paramsObj);

//   return dataObj;
// };

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

export const toggleDropdown = async (toggleType) => {
  if (!toggleType || toggleType !== "dropdown") return null;

  const actionButtonElement = document.getElementById("action-button-element");
  if (!actionButtonElement) return null;

  const isHidden = actionButtonElement.classList.contains("hidden");

  isHidden ? await unhideArray([actionButtonElement]) : await hideArray([actionButtonElement]);

  return true;
};

buildDisplay();
