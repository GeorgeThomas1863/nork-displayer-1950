export const buildAdminDefaultDisplay = async (inputObj) => {
  const { allDataObj } = inputObj;

  const listTitleElement = document.createElement("h2");
  listTitleElement.innerHTML = "Data Already Scraped";
  listTitleElement.classList.add("admin-backend-list-title");

  const adminBackendList = document.createElement("ul");
  adminBackendList.classList.add("admin-backend-list");

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
};
