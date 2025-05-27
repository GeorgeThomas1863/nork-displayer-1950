import { buildCollapseContainer } from "../collapse.js";

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

  //build collapse container
  const vidCollapseObj = {
    titleElement: titleElement,
    contentElement: vidWrapper,
    isExpanded: false,
    className: "vid-wrapper-collapse",
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
    { value: "vid-page-newest-to-oldest", id: "vid-page-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "vid-page-oldest-to-newest", id: "vid-page-oldest-to-newest", text: "Oldest to Newest" },
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

//----------------------------

export const buildVidData = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const vidList = document.createElement("ul");
  vidList.id = "vid-array-element";

  for (let i = 0; i < inputArray.length; i++) {
    const vidListItem = await buildVidListItem(inputArray[i]);
    if (!vidListItem) continue;

    vidList.appendChild(vidListItem);
  }

  return vidList;
};

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
