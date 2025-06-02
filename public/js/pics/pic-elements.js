import { buildCollapseContainer } from "../collapse.js";

//PIC FORM ELEMENTS
export const buildPicForm = async () => {
  const picWrapper = document.createElement("ul");
  picWrapper.id = "pic-wrapper";
  picWrapper.className = "wrapper collapse-content";

  const titleElement = document.createElement("div");
  titleElement.textContent = "PICS";
  // titleElement.setAttribute("data-expand", "pic-dropdown"); //for click listener

  const picTypeListItem = await buildPicTypeListItem();
  const picHowManyListItem = await buildPicHowManyListItem();
  const picSortByListItem = await buildPicSortByListItem();

  picWrapper.append(picTypeListItem, picHowManyListItem, picSortByListItem);

  //build collapse container
  const picCollapseObj = {
    titleElement: titleElement,
    contentElement: picWrapper,
    isExpanded: true,
    className: "pic-wrapper-collapse",
    dataAttribute: "pic-form-header",
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
    { value: "pic-alone", id: "pic-alone", text: "Just Pics", selected: true },
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
  picHowManyInput.placeholder = "[Defaults to 9 (most recent)]";

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

//--------------------------------

//PIC ALONE DATA RETURN ELEMENTS
export const buildPicList = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = document.createElement("ul");
  picArrayElement.id = "pic-list-element";

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

  //build pic / stat elements
  const picElement = await buildPicElement(savePath);
  const picStatsElement = await buildPicStatsElement(inputObj);

  picListItem.append(picElement, picStatsElement);

  return picListItem;
};

//build pic itself
export const buildPicElement = async (savePath) => {
  if (!savePath) return null;

  const picElement = document.createElement("img");
  picElement.id = "pic-element";

  //define pic path
  const fileName = savePath.split("/").pop();
  const picPath = "/kcna-pics/" + fileName;

  picElement.src = picPath;
  picElement.alt = "KCNA PIC";

  return picElement;
};

//build pic stats
export const buildPicStatsElement = async (inputObj) => {
  if (!inputObj) return null;
  const { picDate, picSource, headerData } = inputObj;

  // console.log("INPUT OBJ");
  // console.log(inputObj);

  const picStatsElement = document.createElement("div");
  picStatsElement.id = "pic-stats";

  const picDateElement = await buildPicDateElement(picDate);
  const picSourceElement = await buildPicSourceElement(picSource);
  const picServerElement = await buildPicServerElement(headerData);

  picStatsElement.append(picDateElement, picSourceElement, picServerElement);

  return picStatsElement;
};

//extract / format pic date
export const buildPicDateElement = async (picDate) => {
  if (!picDate) return null;

  const dateElement = document.createElement("div");
  dateElement.id = "pic-date";
  const dateObj = new Date(picDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  dateElement.innerHTML = `<b>Date:</b> ${formattedDate}`;

  return dateElement;
};

//calc where pic from (do on backend)
export const buildPicSourceElement = async (picSource) => {
  if (!picSource) return null;

  const picSourceElement = document.createElement("div");
  picSourceElement.id = "pic-source";
  picSourceElement.innerHTML = `<b>Pic From:</b> ${picSource}`;

  return picSourceElement;
};

//EXTRACT PIC SERVER DATA
export const buildPicServerElement = async (headerData) => {
  if (!headerData || !headerData.server) return null;
  const serverData = headerData.server;

  const picServerElement = document.createElement("div");
  picServerElement.id = "pic-server";
  picServerElement.innerHTML = `<b>Server Data:</b> ${serverData}`;

  return picServerElement;
};

//  --------------------------------

//PIC SET DATA RETURN ELEMENTS
export const buildPicSetListItem = async (inputObj, isFirst) => {
  const { title } = inputObj;

  const picSetListItem = document.createElement("li");
  picSetListItem.className = "pic-set-list-item";

  //builds a pic container for pic array
  const picSetElement = await buildPicSetElement(inputObj);

  //build title element
  const titleElement = await buildPicSetTitle(title);

  // Wrap the article content in a collapsible
  const picSetCollapseObj = {
    titleElement: titleElement,
    contentElement: picSetElement,
    isExpanded: isFirst,
    className: "pic-set-element-collapse",
  };

  const picSetCollapseContainer = await buildCollapseContainer(picSetCollapseObj);
  picSetListItem.append(picSetCollapseContainer);

  return picSetListItem;
};

export const buildPicSetTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "pic-set-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildPicSetElement = async (inputObj) => {
  const { date, picArray } = inputObj;

  const picSetElement = document.createElement("article");
  picSetElement.id = "pic-set-element";

  //Add pics as collapse
  const picSetPicData = await picDropDownContainer(picArray, "PicSet");
  if (picSetPicData) {
    picSetElement.append(picSetPicData);
  }

  // Then append date and text after pictures (title is handled by collapse header)
  const dateElement = await buildPicSetDate(date);

  picSetElement.append(dateElement);

  return picSetElement;
};

export const buildPicSetDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "pic-set-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};
