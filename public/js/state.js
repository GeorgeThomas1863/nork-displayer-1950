import d from "./define-things.js";

export const state = {
  route: "/get-backend-data-route",
  dataType: "pics",
  data: null,
  isFirstLoad: true,
  clickId: null,
  expandType: null,
};

export const newDataTrigger = async () => {
  const { isFirstLoad, data } = state;

  //trigger new data on first load
  if (isFirstLoad || !data) return true;

  console.log("NEW DATA TRIGGER");
  console.log(data);

  return true;
};

export const checkChangeTriggered = async (changeId) => {
  const { changeTriggerArr } = d;

  for (let i = 0; i < changeTriggerArr.length; i++) {
    if (changeId === changeTriggerArr[i]) return true;
  }

  return null;
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
