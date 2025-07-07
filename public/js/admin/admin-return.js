import d from "../util/define-things.js";
import { buildCollapseContainer } from "../util/collapse.js";

export const buildAdminBackendDisplay = async (inputObj) => {
  const { logObj, isFirstLoad } = inputObj;

  console.log("ADMIN BACKEND DISPLAY");
  console.dir(inputObj);

  let displayData = null;
  switch (isFirstLoad) {
    case true:
      //returns 1 thing
      displayData = await buildAdminMongoList(logObj);
      break;

    case false:
      displayData = await buildAdminNewData(inputObj);
      break;
  }

  return displayData;
};

//HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

export const buildAdminNewData = async (inputObj) => {
  const newDataContainer = document.createElement("div");
  newDataContainer.id = "admin-new-data-container";

  //update the old list
  const replaceDefaultListId = document.getElementById("admin-default-list-collapse");
  const newDefaultData = await buildAdminMongoList(inputObj);

  if (replaceDefaultListId) {
    const replaceDefaultElement = replaceDefaultListId.parentElement;
    replaceDefaultElement.remove();
  }

  newDataContainer.append(newDefaultData);

  //update the new list
  const replaceCommandElementId = document.getElementById("admin-new-list-collapse");

  const newCommandListData = await buildAdminCommandList(inputObj);

  if (replaceCommandElementId) {
    const replaceCommandElement = replaceCommandElementId.parentElement;
    replaceCommandElement.remove();
  }

  newDataContainer.append(newCommandListData);

  return newDataContainer;
};

export const buildAdminMongoList = async (inputObj) => {
  const adminDefaultList = document.createElement("ul");
  adminDefaultList.classList.add("admin-default-list");

  const keys = Object.keys(inputObj);

  // Loop through each key
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = inputObj[key];

    // Create list item element
    const listItem = document.createElement("li");
    listItem.classList.add("admin-default-list-item");

    // Set the content
    listItem.innerHTML = `${key}: ${value}`; //not adding mapObj bc frontend

    adminDefaultList.append(listItem);
  }

  //MAKE IT COLLAPSE
  const defaultTitleElement = document.createElement("div");
  defaultTitleElement.innerHTML = "Data Already Scraped";
  defaultTitleElement.className = "collapse-header admin-default-title";
  adminDefaultList.className = "collapse-content";

  const defaultListCollapseObj = {
    titleElement: defaultTitleElement,
    contentElement: adminDefaultList,
    isExpanded: true,
    className: "admin-backend-default-collapse",
    dataAttribute: "admin-default-header",
  };

  const defaultListCollapseContainer = await buildCollapseContainer(defaultListCollapseObj);
  defaultListCollapseContainer.className = "wrapper";

  return defaultListCollapseContainer;
};

export const buildAdminCommandList = async (inputObj) => {
  const { scrapeId } = inputObj;
  const newDataArr = ["scrapeId", "textStr", "scrapeStartTime", "scrapeEndTime"];

  console.log("ADMIN NEW LIST");
  console.dir(inputObj);

  const adminCommandList = document.createElement("ul");
  adminCommandList.id = `admin-command-list-${scrapeId}`;
  // adminNewList.id = `admin-new-list`;
  adminCommandList.classList.add("admin-command-list");

  for (const k in inputObj) {
    if (!newDataArr.includes(k)) continue;

    const listItem = document.createElement("li");

    //custom for textStr
    let str = "";
    if (k === "textStr") {
      str = inputObj[k];
    } else {
      str = `${d.adminNewListMap[k]}: ${inputObj[k]}`;
    }

    listItem.innerHTML = str;
    listItem.classList.add("admin-new-list-item");
    adminCommandList.append(listItem);
  }

  //add back in textStr
  // adminNewList.append(textStr);

  //MAKE IT COLLAPSE
  const newTitleElement = document.createElement("div");
  newTitleElement.innerHTML = "New Scrape Data";
  newTitleElement.className = "collapse-header admin-command-title";
  adminCommandList.className = "collapse-content";
  adminCommandList.id = "admin-command-list-collapse";

  const commandListCollapseObj = {
    titleElement: newTitleElement,
    contentElement: adminCommandList,
    isExpanded: true,
    className: "admin-backend-command-collapse",
    dataAttribute: "admin-command-header",
  };

  const commandListCollapseContainer = await buildCollapseContainer(commandListCollapseObj);
  commandListCollapseContainer.className = "wrapper";

  return commandListCollapseContainer;
};
