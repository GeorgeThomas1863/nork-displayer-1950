import d from "./define-things.js";
import { buildDropDown } from "./build-drop-down.js";
import { buildInputForms } from "./build-forms.js";
// import { buildBackendDefault } from "./build-backend.js";
import { hideArray, unhideArray, sendToBack, buildInputParams, checkNewDataTrigger, buildFailElement } from "./util.js";
import { state, newDataTrigger } from "./state.js";

//get display element
const displayElement = document.getElementById("display-element");
const failElement = await buildFailElement();

//DEFAULT DISPLAY
export const buildDisplay = async () => {
  if (!displayElement) return null;
  const { isFirstLoad } = state;

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
  const backendData = await sendToBack(state);
  const backendDataParsed = await buildBackendDisplay(backendData);
  // console.log("!!!!BACKEND DATA PARSED");
  // console.log(backendDataParsed);

  displayElement.append(backendDataParsed);

  console.log("DISPLAY ELEMENT");
  console.log(displayElement);

  //UPDATE THE STATE HERE
  state.data = backendData;
  state.isFirstLoad = false;

  console.log("CURRENT state");
  console.log(state);

  return "#DONE";
};

export const buildBackendDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return failElement;
  const { isFirstLoad } = state;

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
      if (!dataElement) continue;
      //hide everything except pics on default
      if (dataElement.id !== "pic-array-element") {
        dataElement.classList.add("hidden");
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
export const expandForm = async (dataType) => {
  console.log("EXPAND BACKEND DATA");
  console.log(dataType);

  switch (dataType) {
    case "article-form-header":
      break;

    case "pic-form-header":
      break;
    case "vid-form-header":
      break;
  }

  // Build typeMap using the consistent naming pattern
  // const typeMap = {};
  // for (let i = 0; i < d.expandTypeArr.length; i++) {
  //   const typeValue = d.expandTypeArr[i];
  //   const formHeader = `${typeValue}-form-header`;

  //   typeMap[formHeader] = {
  //     wrapperElement: () => document.getElementById(`${typeValue}-wrapper`),
  //     arrowElement: () => document.querySelector(`#collapse-arrow[data-expand='${formHeader}']`),
  //   };
  // }

  // const currentTypeData = typeMap[dataType];

  // const currentArrow = currentTypeData.arrowElement();
  // const isCurrentExpanded = currentArrow.classList.contains("expanded");

  // // Get all form headers by looping through baseTypes
  // const currentElementArray = [currentTypeData.wrapperElement()];
  // const otherElementArray = [];
  // const otherArrowArray = [];

  // for (let i = 0; i < d.expandTypeArr.length; i++) {
  //   const typeValue = d.expandTypeArr[i];
  //   const formHeader = `${typeValue}-form-header`;

  //   if (formHeader !== dataType) {
  //     const typeData = typeMap[formHeader];
  //     otherElementArray.push(typeData.wrapperElement());
  //     otherArrowArray.push(typeData.arrowElement());
  //   }
  // }

  // if (isCurrentExpanded) {
  //   await hideArray(otherElementArray);
  //   await unhideArray(currentElementArray);

  //   for (let i = 0; i < otherArrowArray.length; i++) {
  //     otherArrowArray[i].classList.remove("expanded");
  //   }
  // } else {
  //   await hideArray(currentElementArray);
  // }

  // return true;
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
