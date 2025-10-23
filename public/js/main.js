//MAIN PAGE
import stateFront from "./util/state-front.js";
import { buildDropDownForm } from "./main-display/drop-down-form.js";
import { buildInputForms } from "./main-display/input-forms.js";
import { buildReturnDisplay } from "./main-display/return-display.js";
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
  // if (!updateArray || !updateArray.length) return null;

  console.log("UPDATE ARRAY");
  console.dir(updateArray);

  console.log("STATE FRONT");
  console.dir(stateFront);

  await updateStateFront(updateArray);

  const returnDisplay = await buildReturnDisplay(updateArray);
  if (!returnDisplay) return null;

  displayElement.append(returnDisplay);

  console.log("STATE FRONT");
  console.dir(stateFront);

  return true;
};

export const updateStateFront = async (inputArray) => {
  const { typeTrigger, articleType } = stateFront;
  stateFront.isFirstLoad = false;

  //Handle article type counts
  if (typeTrigger === "articles") {
    for (const key in stateFront.dataObj.articles) {
      if (key === articleType) {
        stateFront.dataObj.articles[key] = inputArray.length;
        continue;
      }
      //reset all others
      stateFront.dataObj.articles[key] = null;
    }
    return true;
  }

  stateFront.dataObj[typeTrigger] = inputArray.length;

  return true;
};

buildDisplay();
