//MAIN PAGE

import stateFront from "./util/state-front.js";
import { buildDropDownForm } from "./main-display/drop-down-form.js";
import { buildInputForms } from "./input-forms.js";

const displayElement = document.getElementById("display-element");

export const buildDisplay = async () => {
  if (!displayElement) return null;
  const { isFirstLoad } = stateFront;

  if (isFirstLoad) {
    const dropDownElement = await buildDropDownForm();
    const inputFormWrapper = await buildInputForms();

    displayElement.append(dropDownElement);

    // displayElement.append(dropDownElement, inputFormWrapper);

    // FIGURE OUT NON RETARDED WAY TO GET FIRST DATA
    // stateFront.isFirstLoad = false;
    return;
  }
};

buildDisplay();
