import { buildCollapseContainer } from "../collapse.js";

export const buildAdminBackendDisplay = async (inputObj) => {
  const { logObj, isFirstLoad } = inputObj;

  if (isFirstLoad) {
    return await buildAdminDefaultList(logObj);
  }

  const replaceElementId = document.getElementById("admin-new-list-collapse");

  const newListData = await buildAdminNewList(inputObj);
  if (!replaceElementId) {
    return newListData;
  }

  const replaceElement = replaceElementId.parentElement;
  replaceElement.remove();

  return newListData;
};

export const buildAdminDefaultList = async (inputObj) => {
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

export const buildAdminNewList = async (inputObj) => {
  const { scrapeStartTime, scrapeEndTime, textStr, scrapeId } = inputObj;
  const newDataArr = [scrapeStartTime, scrapeEndTime, textStr, scrapeId];

  const adminNewList = document.createElement("ul");
  adminNewList.id = `admin-new-list-${scrapeId}`;
  // adminNewList.id = `admin-new-list`;
  adminNewList.classList.add("admin-new-list");

  for (let i = 0; i < newDataArr.length; i++) {
    const data = newDataArr[i];
    if (!data) continue;

    const listItem = document.createElement("li");
    listItem.innerHTML = `${i.toUpperCase()}: ${data}`;
    listItem.classList.add("admin-new-list-item");
    adminNewList.append(listItem);
  }

  //MAKE IT COLLAPSE
  const newTitleElement = document.createElement("div");
  newTitleElement.innerHTML = "New Scrape Data";
  newTitleElement.className = "collapse-header admin-new-title";
  adminNewList.className = "collapse-content";
  adminNewList.id = "admin-new-list-collapse";

  const newListCollapseObj = {
    titleElement: newTitleElement,
    contentElement: adminNewList,
    isExpanded: true,
    className: "admin-backend-new-collapse",
    dataAttribute: "admin-new-header",
  };

  const newListCollapseContainer = await buildCollapseContainer(newListCollapseObj);
  newListCollapseContainer.className = "wrapper";

  return newListCollapseContainer;
};
