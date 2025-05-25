import { sendToBack } from "./util.js";
import { buildArticleWrapper } from "./parse/parse-articles.js";

//get display element
const displayElement = document.getElementById("display-element");

export const buildDefaultDisplay = async () => {
  //get backend data FIRST (to check for fail )
  const backendDataObj = await getBackendData();

  //FIX / format this later / THROWS ERROR IF ANY ITEM (ARTICLES / PICSET / VIDPAGE) MISSING
  if (!backendDataObj) {
    displayElement.innerHTML = `<h1>BACKEND DATA LOOKUP FUCKED</h1>`;
    return;
  }

  //build input forms
  const inputFormElement = await buildInputForms(backendDataObj);

  //build drop down
  const dropDownElement = await buildDropDown();

  displayElement.append(dropDownElement, inputFormElement);

  return "#DONE";
};

const getBackendData = async () => {
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });
  if (!backendDataObj || !backendDataObj.articleData || !backendDataObj.picSetData || !backendDataObj.vidPageData) {
    console.log("BACKEND DATA FUCKED");
    return null;
  }

  //otherwise return data
  return backendDataObj;
};

const buildInputForms = async (inputData) => {
  if (!inputData) return null;
  const { articleData, picSetData, vidPageData } = inputData;

  const articleWrapper = await buildArticleWrapper(articleData);

  //DELETE
  return articleWrapper;
};

const buildDropDown = async () => {
  console.log("BUILD");
};

buildDefaultDisplay();
