import { buildCollapseContainer } from "../collapse.js";

export const buildAdminBackendDisplay = async (inputObj) => {
  const { allDataObj, scrapeDataObj, scrapeId, isFirstLoad } = inputObj;

  // console.log("BUILD ADMIN BACKEND DISPLAY");
  // console.log(inputObj);

  const adminBackendContainer = document.createElement("div");
  adminBackendContainer.id = "admin-backend-container";

  const defaultListData = await buildAdminDefaultList(allDataObj);

  const defaultTitleElement = document.createElement("h2");
  defaultTitleElement.innerHTML = "Data Already Scraped";
  defaultTitleElement.classList.add("admin-backend-default-title");

  //make default list drop down
  const defaultListCollapseObj = {
    titleElement: defaultTitleElement,
    contentElement: defaultListData,
    isExpanded: true,
    className: "admin-backend-default-collapse",
  };

  const defaultListCollapseContainer = await buildCollapseContainer(defaultListCollapseObj);
  adminBackendContainer.append(defaultListCollapseContainer);

  //if first load RETURN HERE
  if (isFirstLoad) return adminBackendContainer;

  //OTHERWISE get new list data
  const newListData = await buildAdminNewList(scrapeDataObj, scrapeId);

  // console.log("NEW LIST DATA");
  // console.log(newListData);

  const newTitleElement = document.createElement("h2");
  newTitleElement.innerHTML = "New Scrape Data";
  newTitleElement.classList.add("admin-new-title");

  const newListCollapseObj = {
    titleElement: newTitleElement,
    contentElement: newListData,
    isExpanded: true,
    className: "admin-new-collapse",
  };

  const newListCollapseContainer = await buildCollapseContainer(newListCollapseObj);
  adminBackendContainer.append(newListCollapseContainer);

  return adminBackendContainer;
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

    //ADD MAP FUNCTION HERE

    // Set the content
    listItem.innerHTML = `${key}: ${value}`;

    // Append to your list (replace 'yourList' with your actual list element)
    adminDefaultList.append(listItem);
  }

  return adminDefaultList;
};

export const buildAdminNewList = async (inputObj, scrapeId) => {
  const { startTime, endTime, textStr } = inputObj;

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
