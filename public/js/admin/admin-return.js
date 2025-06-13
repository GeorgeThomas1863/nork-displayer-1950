export const buildAdminDefaultDisplay = async (inputObj) => {
  const { allDataObj } = inputObj;

  const adminBackendList = document.createElement("ul");
  adminBackendList.classList.add("admin-backend-list");

  const defaultTitleElement = document.createElement("h2");
  defaultTitleElement.innerHTML = "Data Already Scraped";
  defaultTitleElement.classList.add("admin-backend-default-title");
  adminBackendList.append(defaultTitleElement);

  const keys = Object.keys(allDataObj);

  // Loop through each key
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = allDataObj[key];

    // Create list item element
    const listItem = document.createElement("li");
    listItem.classList.add("admin-backend-list-item");

    // Set the content
    listItem.innerHTML = `${key}: ${value}`;

    // Append to your list (replace 'yourList' with your actual list element)
    adminBackendList.append(listItem);
  }

  return adminBackendList;
};

export const buildAdminNewDisplay = async (inputObj) => {
  console.log("BUILD ADMIN NEW DISPLAY");
  console.log(inputObj);

  const { scrapeDataObj, scrapeId, textStr } = inputObj;
  const { startTime, endTime } = scrapeDataObj;

  const adminNewContainer = document.createElement("div");
  adminNewContainer.classList.add("admin-new-container");

  //get already scraped data
  const adminBackendList = await buildAdminDefaultDisplay(inputObj);

  const newDataList = document.createElement("ul");
  newDataList.classList.add("admin-new-list");

  const newDataTitleElement = document.createElement("h2");
  newDataTitleElement.innerHTML = "New Scrape Data";
  newDataTitleElement.classList.add("admin-new-title");
  newDataList.append(newDataTitleElement);

  //scrape Id
  const scrapeIdElement = document.createElement("li");
  scrapeIdElement.innerHTML = `Scrape ID: ${scrapeId}`;
  scrapeIdElement.classList.add("admin-new-list-item");
  newDataList.append(scrapeIdElement);

  //scrape text
  const scrapeTextElement = document.createElement("li");
  scrapeTextElement.innerHTML = `Scrape Text: ${textStr}`;
  scrapeTextElement.classList.add("admin-new-list-item");
  newDataList.append(scrapeTextElement);

  if (startTime) {
    const startTimeElement = document.createElement("li");
    startTimeElement.innerHTML = `Start Time: ${startTime}`;
    startTimeElement.classList.add("admin-new-list-item");
    newDataList.append(startTimeElement);
  }

  if (endTime) {
    const endTimeElement = document.createElement("li");
    endTimeElement.innerHTML = `End Time: ${endTime}`;
    endTimeElement.classList.add("admin-new-list-item");
    newDataList.append(endTimeElement);
  }

  adminNewContainer.append(newDataList, adminBackendList);

  return adminNewContainer;
};
