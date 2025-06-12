export const buildAdminDefaultDisplay = async (inputObj) => {
  const { allDataObj } = inputObj;

  // console.log("BUILD ADMIN DEFAULT DISPLAY");
  // console.log(inputObj);
  // console.dir(inputObj);

  const adminBackedList = document.createElement("ul");
  const keys = Object.keys(allDataObj);

  // Loop through each key
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = allDataObj[key];

    // Create list item element
    const listItem = document.createElement("li");

    // Set the content
    listItem.innerHTML = `${key}: ${value}`;

    // Append to your list (replace 'yourList' with your actual list element)
    adminBackedList.append(listItem);
  }

  return adminBackedList;
};

export const buildAdminNewDisplay = async (inputObj) => {
  console.log("BUILD ADMIN NEW DISPLAY");
  console.log(inputObj);
};
