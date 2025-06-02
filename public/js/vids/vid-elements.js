import { buildCollapseContainer } from "../collapse.js";

//VID FORM ELEMENTS
export const buildVidForm = async () => {
  const vidWrapper = document.createElement("ul");
  vidWrapper.id = "vid-wrapper";
  vidWrapper.className = "wrapper collapse-content";

  const vidTypeListItem = await buildVidTypeListItem();
  const vidHowManyListItem = await buildVidHowManyListItem();
  const vidSortByListItem = await buildVidSortByListItem();

  vidWrapper.append(vidTypeListItem, vidHowManyListItem, vidSortByListItem);

  const titleElement = document.createElement("div");
  titleElement.textContent = "VIDEOS";
  // titleElement.setAttribute("data-expand", "vid-dropdown"); //for click listener

  //build collapse container
  const vidCollapseObj = {
    titleElement: titleElement,
    contentElement: vidWrapper,
    isExpanded: false,
    className: "vid-wrapper-collapse",
    dataAttribute: "vid-form-header",
  };

  const vidCollapseContainer = await buildCollapseContainer(vidCollapseObj);

  // Apply the wrapper class to the collapse container instead
  vidCollapseContainer.className = "wrapper";

  return vidCollapseContainer;
};

export const buildVidTypeListItem = async () => {
  const vidTypeListItem = document.createElement("li");
  vidTypeListItem.id = "vid-type-list-item";
  vidTypeListItem.className = "form";

  const vidTypeLabel = document.createElement("label");
  vidTypeLabel.setAttribute("for", "vid-type");
  vidTypeLabel.textContent = "Video Type";

  const vidTypeSelect = document.createElement("select");
  vidTypeSelect.name = "vid-type";
  vidTypeSelect.id = "vid-type";

  // Create options for article type select
  const optionArray = [
    { value: "vid-alone", id: "vid-alone", text: "Just Vids", selected: true },
    { value: "vid-pages", id: "vid-pages", text: "Vid Pages" },
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
    vidTypeSelect.append(option);
  }

  vidTypeListItem.append(vidTypeLabel, vidTypeSelect);

  return vidTypeListItem;
};

export const buildVidHowManyListItem = async () => {
  const vidHowManyListItem = document.createElement("li");
  vidHowManyListItem.id = "vid-how-many-list-item";
  vidHowManyListItem.className = "form";

  const vidHowManyLabel = document.createElement("label");
  vidHowManyLabel.setAttribute("for", "vid-how-many");
  vidHowManyLabel.textContent = "How Many?";

  const vidHowManyInput = document.createElement("input");
  vidHowManyInput.type = "text";
  vidHowManyInput.name = "vid-how-many";
  vidHowManyInput.id = "vid-how-many";
  vidHowManyInput.placeholder = "[Defaults to 3 (most recent)]";

  vidHowManyListItem.append(vidHowManyLabel, vidHowManyInput);

  return vidHowManyListItem;
};

export const buildVidSortByListItem = async () => {
  const vidSortByListItem = document.createElement("li");
  vidSortByListItem.id = "vid-sort-by-list-item";
  vidSortByListItem.className = "form";

  const vidSortByLabel = document.createElement("label");
  vidSortByLabel.setAttribute("for", "vid-sort-by");
  vidSortByLabel.textContent = "Sort By";

  const vidSortBySelect = document.createElement("select");
  vidSortBySelect.name = "vid-sort-by";
  vidSortBySelect.id = "vid-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "vid-newest-to-oldest", id: "vid-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "vid-oldest-to-newest", id: "vid-oldest-to-newest", text: "Oldest to Newest" },
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
    vidSortBySelect.append(option);
  }

  vidSortByListItem.append(vidSortByLabel, vidSortBySelect);

  return vidSortByListItem;
};

//--------------------------------

//VID ALONE DATA RETURN ELEMENTS

export const buildVidListItem = async (inputObj) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const vidListItem = document.createElement("li");
  vidListItem.id = "vid-list-item";

  //ADD pic stats here (scrape date, server, size, etc)

  const vidElement = await buildVidElement(savePath);
  vidListItem.append(vidElement);

  return vidListItem;
};

export const buildVidElement = async (savePath) => {
  if (!savePath) return null;

  const vidElement = document.createElement("video");
  vidElement.id = "vid-element";
  vidElement.controls = true;

  const sourceElement = document.createElement("source");
  const fileName = savePath.split("/").pop();
  const vidPath = "/kcna-vids/" + fileName;

  sourceElement.src = vidPath;
  sourceElement.type = "video/mp4";

  vidElement.appendChild(sourceElement);

  return vidElement;
};

//--------------------------------

//VID PAGE DATA RETURN ELEMENTS

export const buildVidPageListItem = async (inputObj, isFirst) => {
  const { title } = inputObj;

  const vidPageListItem = document.createElement("li");
  vidPageListItem.className = "vid-page-list-item";

  //builds a pic container for pic array
  const vidPageElement = await buildVidPageElement(inputObj);

  //build title element
  const titleElement = await buildVidPageTitle(title);

  // Wrap the article content in a collapsible
  const vidPageCollapseObj = {
    titleElement: titleElement,
    contentElement: vidPageElement,
    isExpanded: isFirst,
    className: "vid-page-element-collapse",
  };

  const vidPageCollapseContainer = await buildCollapseContainer(vidPageCollapseObj);
  vidPageListItem.append(vidPageCollapseContainer);

  return vidPageListItem;
};

export const buildVidPageTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "vid-page-title";
  titleElement.textContent = title;

  return titleElement;
};

//NEED TO ENSURE SAVE PATH IS IN INPUT OBJ
export const buildVidPageElement = async (inputObj) => {
  const { date, savePath } = inputObj;

  const vidPageElement = document.createElement("article");
  vidPageElement.id = "vid-page-element";

  // Then append date and text after pictures (title is handled by collapse header)
  const dateElement = await buildVidPageDate(date);

  const vidElement = await buildVidElement(savePath);

  vidPageElement.append(dateElement, vidElement);

  return vidPageElement;
};

export const buildVidPageDate = async (date) => {
  const dateElement = document.createElement("div");
  dateElement.id = "vid-page-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};
