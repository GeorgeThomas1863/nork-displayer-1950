import { buildCollapseContainer } from "../collapse.js";

export const buildPicAloneForm = async () => {
  const picAloneWrapper = document.createElement("ul");
  picAloneWrapper.id = "pic-alone-wrapper";
  picAloneWrapper.className = "wrapper collapse-content";

  const titleElement = document.createElement("div");
  titleElement.textContent = "PICS";

  const picAloneHowManyListItem = await buildPicAloneHowManyListItem();
  const picAloneSortByListItem = await buildPicAloneSortByListItem();

  picAloneWrapper.append(picAloneHowManyListItem, picAloneSortByListItem);

  //build collapse container
  const picAloneCollapseObj = {
    titleElement: titleElement,
    contentElement: picAloneWrapper,
    isExpanded: false,
    className: "pic-alone-wrapper-collapse",
  };

  const picAloneCollapseContainer = await buildCollapseContainer(picAloneCollapseObj);

  // Apply the wrapper class to the collapse container instead
  picAloneCollapseContainer.className = "wrapper";

  return picAloneCollapseContainer;
};

export const buildPicAloneHowManyListItem = async () => {
  const picAloneHowManyListItem = document.createElement("li");
  picAloneHowManyListItem.id = "pic-alone-how-many-list-item";
  picAloneHowManyListItem.className = "form";

  const picAloneHowManyLabel = document.createElement("label");
  picAloneHowManyLabel.setAttribute("for", "pic-alone-how-many");
  picAloneHowManyLabel.textContent = "How Many?";

  const picAloneHowManyInput = document.createElement("input");
  picAloneHowManyInput.type = "text";
  picAloneHowManyInput.name = "pic-alone-how-many";
  picAloneHowManyInput.id = "pic-alone-how-many";
  picAloneHowManyInput.placeholder = "[Defaults to 5 (most recent)]";

  picAloneHowManyListItem.append(picAloneHowManyLabel, picAloneHowManyInput);

  return picAloneHowManyListItem;
};

export const buildPicAloneSortByListItem = async () => {
  const picAloneSortByListItem = document.createElement("li");
  picAloneSortByListItem.id = "pic-alone-sort-by-list-item";
  picAloneSortByListItem.className = "form";

  const picAloneSortByLabel = document.createElement("label");
  picAloneSortByLabel.setAttribute("for", "pic-alone-sort-by");
  picAloneSortByLabel.textContent = "Sort By";

  const picAloneSortBySelect = document.createElement("select");
  picAloneSortBySelect.name = "pic-alone-sort-by";
  picAloneSortBySelect.id = "pic-alone-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "pic-alone-newest-to-oldest", id: "pic-alone-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "pic-alone-oldest-to-newest", id: "pic-alone-oldest-to-newest", text: "Oldest to Newest" },
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
    picAloneSortBySelect.append(option);
  }

  picAloneSortByListItem.append(picAloneSortByLabel, picAloneSortBySelect);

  return picAloneSortByListItem;
};

//------------------------------

//PARSE PIC SETS
export const buildPicSetForm = async () => {
  const picSetWrapper = document.createElement("ul");
  picSetWrapper.id = "pic-set-wrapper";
  picSetWrapper.className = "wrapper collapse-content";

  const picSetHowManyListItem = await buildPicSetHowManyListItem();
  const picSetSortByListItem = await buildPicSetSortByListItem();

  picSetWrapper.append(picSetHowManyListItem, picSetSortByListItem);

  const titleElement = document.createElement("div");
  titleElement.textContent = "PIC SETS";

  //build collapse container
  const picSetCollapseObj = {
    titleElement: titleElement,
    contentElement: picSetWrapper,
    isExpanded: false,
    className: "pic-set-wrapper-collapse",
  };

  const picSetCollapseContainer = await buildCollapseContainer(picSetCollapseObj);

  // Apply the wrapper class to the collapse container instead
  picSetCollapseContainer.className = "wrapper";

  return picSetCollapseContainer;
};

export const buildPicSetHowManyListItem = async () => {
  const picSetHowManyListItem = document.createElement("li");
  picSetHowManyListItem.id = "pic-set-how-many-list-item";
  picSetHowManyListItem.className = "form";

  const picSetHowManyLabel = document.createElement("label");
  picSetHowManyLabel.setAttribute("for", "pic-set-how-many");
  picSetHowManyLabel.textContent = "How Many?";

  const picSetHowManyInput = document.createElement("input");
  picSetHowManyInput.type = "text";
  picSetHowManyInput.name = "pic-set-how-many";
  picSetHowManyInput.id = "pic-set-how-many";
  picSetHowManyInput.placeholder = "[Defaults to 5 (most recent)]";

  picSetHowManyListItem.append(picSetHowManyLabel, picSetHowManyInput);

  return picSetHowManyListItem;
};

export const buildPicSetSortByListItem = async () => {
  const picSetSortByListItem = document.createElement("li");
  picSetSortByListItem.id = "pic-set-sort-by-list-item";
  picSetSortByListItem.className = "form";

  const picSetSortByLabel = document.createElement("label");
  picSetSortByLabel.setAttribute("for", "pic-set-sort-by");
  picSetSortByLabel.textContent = "Sort By";

  const picSetSortBySelect = document.createElement("select");
  picSetSortBySelect.name = "pic-set-sort-by";
  picSetSortBySelect.id = "pic-set-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "pic-set-newest-to-oldest", id: "pic-set-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "pic-set-oldest-to-newest", id: "pic-set-oldest-to-newest", text: "Oldest to Newest" },
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
    picSetSortBySelect.append(option);
  }

  picSetSortByListItem.append(picSetSortByLabel, picSetSortBySelect);

  return picSetSortByListItem;
};

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
