//MAIN PAGE
import stateFront from "./util/state-front.js";
import { buildDropDownForm } from "./main-display/drop-down-form.js";
import { buildInputForms } from "./main-display/input-forms.js";
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

  displayElement.append(updateData);
  return displayElement;
};

export const getUpdateData = async () => {
  console.log("GET UPDATE DATA");
  const data = await sendToBack({ route: "/update-data-route", stateFront: stateFront });

  if (!data) return null;

  console.log("UPDATE DATA");
  console.dir(data);

  //parse update data BY TYPE (use stateFRONT)
  //parse articleReturn / picReturn / picSetReturn / vidPageReturn / vidReturn, etc

  //update stateFront

  return data;
};

buildDisplay();
