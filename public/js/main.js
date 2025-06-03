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
  const newDataTrigger = await checkNewDataTrigger(inputObj);
  if (!newDataTrigger) return null;

  //get user input, combine with params
  const userInputParams = await buildInputParams();

  const paramsObj = { ...userInputParams, ...inputObj };
  paramsObj.route = "/get-new-data-route";
  const dataObj = await sendToBack(paramsObj);

  return dataObj;
};

//better version of expand backend data equation
export const expandBackendData = async (dataType) => {
  console.log("AHHHHHHHHHHHHHH");
  console.log(dataType);
  // Build typeMap using the consistent naming pattern
  const typeMap = {};
  for (let i = 0; i < d.expandTypeArr.length; i++) {
    const typeValue = d.expandTypeArr[i];
    const formHeader = `${typeValue}-form-header`;

    typeMap[formHeader] = {
      wrapperElement: () => document.getElementById(`${typeValue}-wrapper`),
      dataElement: () => document.getElementById(`${typeValue}-array-element`),
      arrowElement: () => document.querySelector(`#collapse-arrow[data-expand='${formHeader}']`),
    };
  }

  const currentTypeData = typeMap[dataType];

  const currentArrow = currentTypeData.arrowElement();
  const isCurrentExpanded = currentArrow.classList.contains("expanded");

  // console.log("CURRENT ARROW!!!!");
  // console.log(currentArrow);

  // Get all form headers by looping through baseTypes
  const currentElementArray = [currentTypeData.wrapperElement(), currentTypeData.dataElement()];
  const otherElementArray = [];
  const otherArrowArray = [];

  for (let i = 0; i < d.expandTypeArr.length; i++) {
    const typeValue = d.expandTypeArr[i];
    const formHeader = `${typeValue}-form-header`;

    if (formHeader !== dataType) {
      const typeData = typeMap[formHeader];
      otherElementArray.push(typeData.wrapperElement());
      otherElementArray.push(typeData.dataElement());
      otherArrowArray.push(typeData.arrowElement());
    }
  }

  console.log("OTHER ELEMENT ARRAY!!!!");
  console.log(otherElementArray);

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
