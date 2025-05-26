import { buildCollapseContainer } from "../collapse.js";

export const buildPicForm = async () => {
  const picWrapper = document.createElement("ul");
  picWrapper.id = "pic-wrapper";
  picWrapper.className = "wrapper collapse-content";

  const titleElement = document.createElement("div");
  titleElement.textContent = "PICS";

  const picTypeListItem = await buildPicTypeListItem();
  const picHowManyListItem = await buildPicHowManyListItem();
  const picSortByListItem = await buildPicSortByListItem();

  picWrapper.append(picTypeListItem, picHowManyListItem, picSortByListItem);

  //build collapse container
  const picCollapseObj = {
    titleElement: titleElement,
    contentElement: picWrapper,
    isExpanded: false,
    className: "pic-wrapper-collapse",
  };

  const picCollapseContainer = await buildCollapseContainer(picCollapseObj);

  // Apply the wrapper class to the collapse container instead
  picCollapseContainer.className = "wrapper";

  return picCollapseContainer;
};

export const buildPicTypeListItem = async () => {
  const picTypeListItem = document.createElement("li");
  picTypeListItem.id = "pic-type-list-item";
  picTypeListItem.className = "form";

  const picTypeLabel = document.createElement("label");
  picTypeLabel.setAttribute("for", "pic-type");
  picTypeLabel.textContent = "Pic Type";

  const picTypeSelect = document.createElement("select");
  picTypeSelect.name = "pic-type";
  picTypeSelect.id = "pic-type";

  // Create options for article type select
  const optionArray = [
    { value: "pics-alone", id: "pics-alone", text: "Just Pics", selected: true },
    { value: "pic-sets", id: "pic-sets", text: "Pic Sets" },
  ];

  for (let i = 0; i < optionArray.length; i++) {
    const optionData = optionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    picTypeSelect.append(option);
  }

  picTypeListItem.append(picTypeLabel, picTypeSelect);

  return picTypeListItem;
};

export const buildPicHowManyListItem = async () => {
  const picHowManyListItem = document.createElement("li");
  picHowManyListItem.id = "pic-how-many-list-item";
  picHowManyListItem.className = "form";

  const picHowManyLabel = document.createElement("label");
  picHowManyLabel.setAttribute("for", "pic-how-many");
  picHowManyLabel.textContent = "How Many?";

  const picHowManyInput = document.createElement("input");
  picHowManyInput.type = "text";
  picHowManyInput.name = "pic-how-many";
  picHowManyInput.id = "pic-how-many";
  picHowManyInput.placeholder = "[Defaults to 5 (most recent)]";

  picHowManyListItem.append(picHowManyLabel, picHowManyInput);

  return picHowManyListItem;
};

export const buildPicSortByListItem = async () => {
  const picSortByListItem = document.createElement("li");
  picSortByListItem.id = "pic-sort-by-list-item";
  picSortByListItem.className = "form";

  const picSortByLabel = document.createElement("label");
  picSortByLabel.setAttribute("for", "pic-sort-by");
  picSortByLabel.textContent = "Sort By";

  const picSortBySelect = document.createElement("select");
  picSortBySelect.name = "pic-sort-by";
  picSortBySelect.id = "pic-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "pic-newest-to-oldest", id: "pic-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "pic-oldest-to-newest", id: "pic-oldest-to-newest", text: "Oldest to Newest" },
  ];

  for (let i = 0; i < optionArray.length; i++) {
    const optionData = optionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    picSortBySelect.append(option);
  }

  picSortByListItem.append(picSortByLabel, picSortBySelect);

  return picSortByListItem;
};

//------------------------------

// //PARSE PIC SETS
// export const buildPicSetForm = async () => {
//   const picSetWrapper = document.createElement("ul");
//   picSetWrapper.id = "pic-set-wrapper";
//   picSetWrapper.className = "wrapper collapse-content";

//   const picSetHowManyListItem = await buildPicSetHowManyListItem();
//   const picSetSortByListItem = await buildPicSetSortByListItem();

//   picSetWrapper.append(picSetHowManyListItem, picSetSortByListItem);

//   const titleElement = document.createElement("div");
//   titleElement.textContent = "PIC SETS";

//   //build collapse container
//   const picSetCollapseObj = {
//     titleElement: titleElement,
//     contentElement: picSetWrapper,
//     isExpanded: false,
//     className: "pic-set-wrapper-collapse",
//   };

//   const picSetCollapseContainer = await buildCollapseContainer(picSetCollapseObj);

//   // Apply the wrapper class to the collapse container instead
//   picSetCollapseContainer.className = "wrapper";

//   return picSetCollapseContainer;
// };

// export const buildPicSetHowManyListItem = async () => {
//   const picSetHowManyListItem = document.createElement("li");
//   picSetHowManyListItem.id = "pic-set-how-many-list-item";
//   picSetHowManyListItem.className = "form";

//   const picSetHowManyLabel = document.createElement("label");
//   picSetHowManyLabel.setAttribute("for", "pic-set-how-many");
//   picSetHowManyLabel.textContent = "How Many?";

//   const picSetHowManyInput = document.createElement("input");
//   picSetHowManyInput.type = "text";
//   picSetHowManyInput.name = "pic-set-how-many";
//   picSetHowManyInput.id = "pic-set-how-many";
//   picSetHowManyInput.placeholder = "[Defaults to 5 (most recent)]";

//   picSetHowManyListItem.append(picSetHowManyLabel, picSetHowManyInput);

//   return picSetHowManyListItem;
// };

// export const buildPicSetSortByListItem = async () => {
//   const picSetSortByListItem = document.createElement("li");
//   picSetSortByListItem.id = "pic-set-sort-by-list-item";
//   picSetSortByListItem.className = "form";

//   const picSetSortByLabel = document.createElement("label");
//   picSetSortByLabel.setAttribute("for", "pic-set-sort-by");
//   picSetSortByLabel.textContent = "Sort By";

//   const picSetSortBySelect = document.createElement("select");
//   picSetSortBySelect.name = "pic-set-sort-by";
//   picSetSortBySelect.id = "pic-set-sort-by";

//   // Create options for sort by select
//   const optionArray = [
//     { value: "pic-set-newest-to-oldest", id: "pic-set-newest-to-oldest", text: "Newest to Oldest", selected: true },
//     { value: "pic-set-oldest-to-newest", id: "pic-set-oldest-to-newest", text: "Oldest to Newest" },
//   ];

//   for (let i = 0; i < optionArray.length; i++) {
//     const optionData = optionArray[i];
//     const option = document.createElement("option");
//     option.value = optionData.value;
//     option.id = optionData.id;
//     option.textContent = optionData.text;
//     if (optionData.selected) {
//       option.selected = true;
//     }
//     picSetSortBySelect.append(option);
//   }

//   picSetSortByListItem.append(picSetSortByLabel, picSetSortBySelect);

//   return picSetSortByListItem;
// };

//----------------------------------

export const buildPicSetData = async (inputArray) => {
  console.log("BUILD");
};

//-----------------------------------

//PARSE PICS

export const buildPicArrayCollapse = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = await buildPicArray(inputArray);
  if (!picArrayElement) return null;

  //build pic title element
  const picTitleElement = document.createElement("div");
  picTitleElement.id = "article-pic-header";
  picTitleElement.textContent = `${inputArray.length} ARTICLE PIC${inputArray.length > 1 ? "S" : ""}`;

  //build collapse container
  const picCollapseObj = {
    titleElement: picTitleElement,
    contentElement: picArrayElement,
    isExpanded: true,
    className: "article-pic-collapse",
  };

  const picCollapseElement = await buildCollapseContainer(picCollapseObj);

  return picCollapseElement;
};

export const buildPicArray = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = document.createElement("ul");
  picArrayElement.id = "pic-array-element";

  for (let i = 0; i < inputArray.length; i++) {
    const picListItem = await buildPicListItem(inputArray[i]);
    if (!picListItem) continue;

    picArrayElement.append(picListItem);
  }

  return picArrayElement;
};

export const buildPicListItem = async (inputObj) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const picListItem = document.createElement("li");
  picListItem.id = "pic-list-item";

  //ADD pic stats here (scrape date, server, size, etc)

  const picElement = await buildPicElement(savePath);
  picListItem.append(picElement);

  return picListItem;
};

export const buildPicElement = async (savePath) => {
  const picElement = document.createElement("img");
  picElement.id = "pic-element";

  //define pic path
  const fileName = savePath.split("/").pop();
  const picPath = "/kcna-pics/" + fileName;

  picElement.src = picPath;
  picElement.alt = "KCNA PIC";

  return picElement;
};
