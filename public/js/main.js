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

  const updateData = await getUpdateData();
  if (!updateData) return displayElement;

  console.log("UPDATE DATA");
  console.dir(updateData);

  displayElement.append(updateData);

  //update stateFront
  return displayElement;
};

export const getUpdateData = async () => {
  if (!displayElement) return null;

  console.log("GET UPDATE DATA");
  const updateArray = await sendToBack({ route: "/update-data-route", stateFront: stateFront });
  if (!updateArray || !updateArray.length) return null;

  console.log("UPDATE ARRAY");
  console.dir(updateArray);

  const returnDisplay = await buildReturnDisplay(updateArray);

  await updateStateFront(updateArray);

  return returnDisplay;
};

export const updateStateFront = async (inputArray) => {
  const { typeTrigger, articleType } = stateFront;
  stateFront.isFirstLoad = false;

  //UPDATE STATE FRONT HERE
  if (typeTrigger === "articles") {
    stateFront.dataObj.articles[articleType] = inputArray.length;
    return true;
  }

  stateFront.dataObj[typeTrigger] = inputArray.length;

  return true;
};

buildDisplay();
