//MAIN PAGE
import stateFront from "./util/state-front.js";
import { updateStateFront } from "./util/state-front.js";
import { buildDropDownForm } from "./util/drop-down.js";
import { buildInputForms } from "./control/input-forms.js";
import { buildReturnDisplay } from "./control/return-form.js";
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

  const updateDataRoute = await sendToBack({ route: "/get-backend-value-route", key: "updateDisplayDataRoute" });

  const updateArray = await sendToBack({ route: updateDataRoute.value, stateFront: stateFront });
  await updateStateFront(updateArray);

  console.log("UPDATE DATA");
  console.dir(updateArray || "NO UPDATE DATA");

  // also handles empty display
  const returnDisplay = await buildReturnDisplay(updateArray);
  if (!returnDisplay) return null;

  displayElement.append(returnDisplay);

  console.log("STATE FRONT");
  console.dir(stateFront);

  return true;
};

buildDisplay();
