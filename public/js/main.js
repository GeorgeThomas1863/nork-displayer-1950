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

  console.log("INPUT DATA");
  console.dir(inputData);

  const articleWrapper = await buildArticleWrapper(articleData);

  //BUILD PIC SET WRAPPER

  //BUILD VID PAGE WRAPPER

  //DELETE
  return articleWrapper;
};

export const buildDropDown = async () => {
  // Create main drop-down container
  const dropDownElement = document.createElement("div");
  dropDownElement.id = "drop-down";

  // Create bars link element
  const dropDownBars = document.createElement("a");
  dropDownBars.id = "drop-down-bars";
  dropDownBars.setAttribute("data-action", "toggle-dropdown");

  // Create three spans for the bars
  for (let i = 0; i < 3; i++) {
    const span = document.createElement("span");
    span.setAttribute("data-action", "toggle-dropdown");
    dropDownBars.appendChild(span);
  }

  // Assemble the dropdown
  dropDownElement.appendChild(dropDownBars);

  //build action buttons
  const actionButtonElement = await buildActionButtonElement();
  dropDownElement.appendChild(actionButtonElement);

  return dropDownElement;
};

export const buildActionButtonElement = async () => {
  const actionButtonElement = document.createElement("ul");
  actionButtonElement.id = "action-button-element";

  //hidden by default
  actionButtonElement.classList.add("hidden");

  const actionButtonArray = [
    //hidden by default
    { id: "scrape-kcna-action-button", text: "Scrape KCNA", class: "action-button" },
    { id: "track-crypto-action-button", text: "Track Crypto", class: "action-button" },
  ];

  for (let i = 0; i < actionButtonArray.length; i++) {
    const li = document.createElement("li");
    const button = document.createElement("button");

    button.id = actionButtonArray[i].id;
    button.textContent = actionButtonArray[i].text;
    button.className = actionButtonArray[i].class;

    li.appendChild(button);
    actionButtonElement.appendChild(li);
  }

  return actionButtonElement;
};

buildDefaultDisplay();
