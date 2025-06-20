import d from "./define-things.js";
import { buildInputParams } from "./util.js";

export const state = {
  route: "/get-backend-data-route",
  dataType: "pics",
  data: null,
  isFirstLoad: true,
  clickId: null,
  expandType: null,
};

export const checkEventTriggered = async (changeId) => {
  const { changeTriggerArr } = d;

  for (let i = 0; i < changeTriggerArr.length; i++) {
    if (changeId === changeTriggerArr[i]) return true;
  }

  return null;
};

export const newDataTrigger = async () => {
  const { isFirstLoad, data } = state;
  console.log("NEW DATA TRIGGER");
  console.log("AHHHHHHHHHHH");
  console.log(state);

  //trigger new data on first load
  if (isFirstLoad || !data) return true;

  const inputParams = await buildInputParams();
  const defaultParams = d.defaultInputMap;

  const diffArr = [];
  for (const key in inputParams) {
    const inputItem = inputParams[key];
    if (inputItem === defaultParams[key]) continue;
    // console.log("AHHHHHHHHHHHH");
    // console.log(key);
    // console.log(inputItem);
    // console.log(defaultParams[key]);
  }

  return true;
};

// MAKE BELOW CLICK TRIGGER
// export const checkNewDataTrigger = async (inputObj) => {
//     const { clickId, expandType, inputId } = inputObj;

//     for (let i = 0; i < d.clickTriggerArr.length; i++) {
//       if (clickId === d.clickTriggerArr[i]) {
//         return "click";
//       }
//     }

//     for (let i = 0; i < d.expandTriggerArr.length; i++) {
//       if (expandType === d.expandTriggerArr[i]) {
//         return "expand";
//       }
//     }

//     //MIGHT NOT BE NEEDED
//     for (let i = 0; i < d.inputTriggerArr.length; i++) {
//       if (inputId === d.inputTriggerArr[i]) {
//         return "input";
//       }
//     }

//     return null;
//   };
