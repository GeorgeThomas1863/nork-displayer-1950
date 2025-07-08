import d from "../util/define-things.js";
import { buildCollapseContainer } from "../util/collapse.js";

export const buildAdminBackendDisplay = async (inputObj) => {
  const { isFirstLoad } = inputObj;

  console.log("ADMIN BACKEND DISPLAY");
  console.dir(inputObj);

  let displayData = null;
  switch (isFirstLoad) {
    case true:
      //returns 1 thing
      displayData = await buildAdminFirstLoad(inputObj);
      break;

    case false:
      displayData = await buildAdminNewData(inputObj);
      break;
  }

  return displayData;
};

export const buildAdminFirstLoad = async (inputObj) => {
  const { logObj } = inputObj;

  const adminDefaultContainer = document.createElement("div");
  adminDefaultContainer.id = "admin-default-container";

  const adminDefaultList = await buildAdminMongoList(logObj, "default");
  adminDefaultContainer.append(adminDefaultList);

  return adminDefaultContainer;
};

export const buildAdminNewData = async (inputObj) => {
  const { logObj } = inputObj;

  const newDataContainer = document.createElement("div");
  newDataContainer.id = "admin-new-data-container";

  //update the new list
  const replaceCommandElementId = document.getElementById("admin-command-list-collapse");

  const newCommandListData = await buildAdminCommandList(inputObj);

  if (replaceCommandElementId) {
    const replaceCommandParent = replaceCommandElementId.parentElement;
    replaceCommandParent.remove();
  }

  //update the old list
  const replaceDefaultListId = document.getElementById("admin-default-list-collapse");
  const newDefaultData = await buildAdminMongoList(logObj, "default");

  if (replaceDefaultListId) {
    const replaceDefaultParent = replaceDefaultListId.parentElement;
    replaceDefaultParent.remove();
  }

  newDataContainer.append(newCommandListData, newDefaultData);

  //get new list data
  const replaceNewListId = document.getElementById("admin-new-list-collapse");
  const newListData = await buildAdminMongoList(logObj, "new");

  if (replaceNewListId) {
    const replaceNewParent = replaceNewListId.parentElement;
    replaceNewParent.remove();
  }

  newDataContainer.append(newListData);

  return newDataContainer;
};

export const buildAdminMongoList = async (inputObj, listType) => {
  const adminDefaultList = document.createElement("ul");
  adminDefaultList.classList.add(`admin-${listType}-list`);

  const keys = Object.keys(inputObj);

  // Loop through each key
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = inputObj[key];

    // Create list item element
    const listItem = document.createElement("li");
    listItem.classList.add(`admin-${listType}-list-item`);

    // Set the content
    listItem.innerHTML = `${key}: ${value}`; //not adding mapObj bc frontend

    adminDefaultList.append(listItem);
  }

  let headerStr = "";
  if (listType === "default") {
    headerStr = "CURRENT STATS";
  } else if (listType === "new") {
    headerStr = "NEW STATS";
  }

  //MAKE IT COLLAPSE
  const defaultTitleElement = document.createElement("div");
  defaultTitleElement.innerHTML = headerStr;
  defaultTitleElement.className = `collapse-header admin-${listType}-title`;
  adminDefaultList.className = "collapse-content";

  const defaultListCollapseObj = {
    titleElement: defaultTitleElement,
    contentElement: adminDefaultList,
    isExpanded: true,
    className: `admin-backend-${listType}-collapse`,
    dataAttribute: `admin-${listType}-header`,
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
