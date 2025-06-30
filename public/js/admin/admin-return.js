import { buildCollapseContainer } from "../collapse.js";

export const buildAdminBackendDisplay = async (inputObj) => {
  const { logObj, isFirstLoad } = inputObj;

  const adminBackendWrapper = document.createElement("div");
  adminBackendWrapper.id = "admin-backend-wrapper";

  if (isFirstLoad) {
    const defaultListData = await buildAdminDefaultList(logObj);
    adminBackendWrapper.append(defaultListData);
    return adminBackendWrapper;
  }

  //do first before creating another new list
  // const replaceWrapper = document.getElementById("admin-backend-wrapper");
  const replaceElement = document.getElementById("admin-new-list");

  const newListData = await buildAdminNewList(inputObj);

  if (!replaceElement) {
    adminBackendWrapper.append(newListData);
    return adminBackendWrapper;
  }

  //otherwise replace it
  adminBackendWrapper.replaceChild(newListData, replaceElement);
  return adminBackendWrapper;
};

// console.log("BUILD ADMIN BACKEND DISPLAY");
// console.dir(inputObj);

// adminBackendContainer.append(defaultListData);

// //if first load RETURN HERE
// if (isFirstLoad) return adminBackendContainer;

//HERE!!!!

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
// };

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
  adminNewList.id = `admin-list-${scrapeId}`;
  adminNewList.classList.add("admin-new-list");

  for (let i = 0; i < newDataArr.length; i++) {
    const data = newDataArr[i];
    if (!data) continue;

    const listItem = document.createElement("li");
    listItem.innerHTML = `${data}`;
    listItem.classList.add("admin-new-list-item");
    adminNewList.append(listItem);
  }

  //MAKE IT COLLAPSE
  const newTitleElement = document.createElement("div");
  newTitleElement.innerHTML = "New Scrape Data";
  newTitleElement.className = "collapse-header admin-new-title";
  adminNewList.className = "collapse-content";

  const newListCollapseObj = {
    titleElement: newTitleElement,
    contentElement: adminNewList,
    isExpanded: true,
    className: "admin-backend-new-collapse",
    dataAttribute: "admin-new-header",
  };

  const newListCollapseContainer = await buildCollapseContainer(newListCollapseObj);
  newListCollapseContainer.className = "wrapper";

  const adminNewListArray = document.querySelectorAll(".admin-new-list");

  console.log("ADMIN NEW LIST ARRAY");
  console.dir(adminNewListArray);

  return newListCollapseContainer;

  // console.log("BUILD ADMIN NEW DISPLAY");
  // console.dir(inputObj);

  // //scrape Id
  // const scrapeIdElement = document.createElement("li");
  // scrapeIdElement.innerHTML = `Scrape ID: ${scrapeId}`;
  // scrapeIdElement.classList.add("admin-new-list-item");
  // adminNewList.append(scrapeIdElement);

  // //scrape text
  // if (textStr) {
  //   const scrapeTextElement = document.createElement("li");
  //   scrapeTextElement.innerHTML = `Scrape Text: ${textStr}`;
  //   scrapeTextElement.classList.add("admin-new-list-item");
  //   adminNewList.append(scrapeTextElement);
  // }

  // if (startTime) {
  //   const startTimeElement = document.createElement("li");
  //   startTimeElement.innerHTML = `Start Time: ${startTime}`;
  //   startTimeElement.classList.add("admin-new-list-item");
  //   adminNewList.append(startTimeElement);
  // }

  // if (endTime) {
  //   const endTimeElement = document.createElement("li");
  //   endTimeElement.innerHTML = `End Time: ${endTime}`;
  //   endTimeElement.classList.add("admin-new-list-item");
  //   adminNewList.append(endTimeElement);
  // }

  // return adminNewList;
};
