import { buildCollapseContainer } from "../collapse.js";

export const buildAdminBackendDisplay = async (inputObj) => {
  const { logObj, scrapeDataObj, scrapeId, isFirstLoad, textStr } = inputObj;

  console.log("BUILD ADMIN BACKEND DISPLAY");
  console.dir(inputObj);

  const adminBackendContainer = document.createElement("div");
  adminBackendContainer.id = "admin-backend-container";

  const defaultListData = await buildAdminDefaultList(logObj);
  // defaultListData.className = "collapse-content";

  adminBackendContainer.append(defaultListData);

  //if first load RETURN HERE
  if (isFirstLoad) return adminBackendContainer;

  // const newListData = await buildAdminNewList(inputObj);
  // newListData.className = "collapse-content";

  // // console.log("NEW LIST DATA");
  // // console.log(newListData);

  // const newTitleElement = document.createElement("div");
  // newTitleElement.innerHTML = "New Scrape Data";
  // newTitleElement.className = "collapse-header admin-new-title";

  // const newListCollapseObj = {
  //   titleElement: newTitleElement,
  //   contentElement: newListData,
  //   isExpanded: true,
  //   className: "admin-new-collapse",
  //   dataAttribute: "admin-new-header",
  // };

  // const newListCollapseContainer = await buildCollapseContainer(newListCollapseObj);
  // newListCollapseContainer.className = "wrapper";
  // adminBackendContainer.append(newListCollapseContainer);

  // return adminBackendContainer;
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
  const { startTime, endTime, textStr, scrapeId } = inputObj;

  // console.log("BUILD ADMIN NEW DISPLAY");
  // console.log(inputObj);

  const adminNewList = document.createElement("ul");
  adminNewList.classList.add("admin-new-list");

  //scrape Id
  const scrapeIdElement = document.createElement("li");
  scrapeIdElement.innerHTML = `Scrape ID: ${scrapeId}`;
  scrapeIdElement.classList.add("admin-new-list-item");
  adminNewList.append(scrapeIdElement);

  //scrape text
  if (textStr) {
    const scrapeTextElement = document.createElement("li");
    scrapeTextElement.innerHTML = `Scrape Text: ${textStr}`;
    scrapeTextElement.classList.add("admin-new-list-item");
    adminNewList.append(scrapeTextElement);
  }

  if (startTime) {
    const startTimeElement = document.createElement("li");
    startTimeElement.innerHTML = `Start Time: ${startTime}`;
    startTimeElement.classList.add("admin-new-list-item");
    adminNewList.append(startTimeElement);
  }

  if (endTime) {
    const endTimeElement = document.createElement("li");
    endTimeElement.innerHTML = `End Time: ${endTime}`;
    endTimeElement.classList.add("admin-new-list-item");
    adminNewList.append(endTimeElement);
  }

  return adminNewList;
};
