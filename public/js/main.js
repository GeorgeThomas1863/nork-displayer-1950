import { sendToBack } from "./util.js";

//get display element
const displayElement = document.getElementById("display-element");

export const buildDefaultDisplay = async () => {
  displayElement.innerHTML = `
        <h1>ALLAHU AKBAR</h1>
    `;

  //build drop down
  const dropDownElement = await buildDropDown();

  //get backend data
  const backendDataObj = await getBackendData();

  //FIX / format this later / THROWS ERROR IF ANY ITEM (ARTICLES / PICSET / VIDPAGE) MISSING
  if (!backendDataObj) {
    displayElement.innerHTML = `<h1>BACKEND DATA LOOKUP FUCKED</h1>`;
    return;
  }

  //build input forms
  const inputFormElement = await buildInputForms(backendDataObj);

  displayElement.append(dropDownElement, inputFormElement);

  return "#DONE";
};

const getBackendData = async () => {
  try {
    const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });
    if (!backendDataObj || !backendDataObj.articleData || !backendDataObj.picSetData || !backendDataObj.vidPageData) {
      const error = new Error("BACKEND DATA FUCKED");
      error.dataReturned = backendDataObj;
      throw error;
    }
    //otherwise return data
    return backendDataObj;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const buildDropDown = async () => {
  console.log("BUILD");
};

const buildInputForms = async (inputData) => {
  if (!inputData) return null;
  const { articleData, picSetData, vidPageData } = inputData;
  console.log("BUILD");
};

buildDefaultDisplay();
