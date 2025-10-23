//MAIN PAGE
import stateFront from "./util/state-front.js";
import { dataObjExistsCheck, updateStateFront } from "./util/state-front.js";
import { buildDropDownForm } from "./main-display/drop-down-form.js";
import { buildInputForms } from "./main-display/input-forms.js";
import { buildReturnDisplay, buildEmptyDisplay } from "./main-display/return-display.js";
import { sendToBack } from "./util/api-front.js";

const displayElement = document.getElementById("display-element");

export const buildDisplay = async () => {
  if (!displayElement) return null;
  const { isFirstLoad } = stateFront;

  if (isFirstLoad) {
    const dropDownElement = await buildDropDownForm();
    const inputFormWrapper = await buildInputForms();
    displayElement.append(dropDownElement, inputFormWrapper);
  }

  await updateDisplay();

  return true;
};

export const updateDisplay = async () => {
  if (!displayElement) return null;

  //remove current data element
  const currentDataElement = document.getElementById("return-display-wrapper");
  if (currentDataElement) currentDataElement.remove();

  console.log("GET UPDATE DATA");
  const updateArray = await sendToBack({ route: "/update-data-route", stateFront: stateFront });

  if (!updateArray || !updateArray.length) await updateStateFront(updateArray);

  //empty display
  const dataObjExists = dataObjExistsCheck();
  console.log("DATA OBJ EXISTS");
  console.dir(dataObjExists);
  console.log("STATE FRONT");
  console.dir(stateFront);
  if (!dataObjExists) {
    const emptyDisplay = await buildEmptyDisplay();
    displayElement.append(emptyDisplay);
    return true;
  }

  const returnDisplay = await buildReturnDisplay(updateArray);
  if (!returnDisplay) return null;

  displayElement.append(returnDisplay);

  console.log("STATE FRONT");
  console.dir(stateFront);

  return true;
};

buildDisplay();
