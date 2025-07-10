import { state, updateStateDataLoaded } from "./util/state.js";
import { buildDropDown } from "./forms/build-drop-down.js";
import { buildInputForms } from "./forms/build-forms.js";
import { buildBackendDisplay, displayFail } from "./forms/build-backend.js";
import { sendToBack } from "./util/api-front.js";
import { checkNewDataNeeded, checkHideUnhideData } from "./util/check-data.js";

//get display element
const displayElement = document.getElementById("display-element");

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
  const newDataNeeded = await checkNewDataNeeded();
  if (!newDataNeeded) {
    //if new data not needed, check if hide / unhide data
    await checkHideUnhideData();
    return null;
  }

  console.log("!!!STATE");
  console.log(state);

  //get / parse backend data (returns array of objects)
  const backendData = await sendToBack(state);
  // console.log("!!!BACKEND DATA");
  // console.log(backendData);

  //NO BACKEND DATA ON FIRST LOAD
  if (!backendData) {
    //ensure below doesnt fuck things
    // await displayFail();
    return true;
  }

  const backendDataParsed = await buildBackendDisplay(backendData);

  //on fail
  if (!backendDataParsed) {
    await displayFail();
    return null;
  }

  //otherwise append data
  displayElement.append(backendDataParsed);

  //UPDATE data loaded (also updates active article)
  await updateStateDataLoaded(backendData);

  console.log("!!!DISPLAY ELEMENT");
  console.log(displayElement);

  return "#DONE";
};

buildDisplay();
