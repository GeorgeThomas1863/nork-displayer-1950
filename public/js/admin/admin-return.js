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
  const { scrapeDataObj } = inputObj;

  const adminNewContainer = document.createElement("div");
  adminNewContainer.classList.add("admin-new-container");

  //get already scraped data
  const adminBackendList = await buildAdminDefaultDisplay(inputObj);

  //get new data
  const newDataList = document.createElement("ul");
  newDataList.classList.add("admin-new-list");

  const newDataTitleElement = document.createElement("h2");
  newDataTitleElement.innerHTML = "New Data";
  newDataTitleElement.classList.add("admin-new-title");
  newDataList.append(newDataTitleElement);

  const keys = Object.keys(scrapeDataObj);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = scrapeDataObj[key];

    const listItem = document.createElement("li");
    listItem.classList.add("admin-new-list-item");

    listItem.innerHTML = `${key}: ${value}`;

    newDataList.append(listItem);
  }

  adminNewContainer.append(adminBackendList, newDataList);

  return adminNewContainer;
};
