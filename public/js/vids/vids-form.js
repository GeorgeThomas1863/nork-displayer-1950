import { buildCollapseContainer } from "../util/collapse-display.js";

//VID FORM ELEMENTS
export const buildVidsForm = async () => {
  const vidWrapper = document.createElement("ul");
  vidWrapper.id = "vid-wrapper";
  vidWrapper.className = "input-type-wrapper";

  // const vidTypeListItem = await buildVidTypeListItem();
  const vidHowManyListItem = await buildVidHowManyListItem();
  const vidSortByListItem = await buildVidSortByListItem();

  vidWrapper.append(vidHowManyListItem, vidSortByListItem);

  const titleElement = document.createElement("div");
  titleElement.textContent = "Vids";

  //build collapse container
  const vidCollapseObj = {
    titleElement: titleElement,
    contentElement: vidWrapper,
    isExpanded: false,
    className: "vid-wrapper-collapse",
    dataAttribute: "get-vids",
  };

  const vidCollapseContainer = await buildCollapseContainer(vidCollapseObj);

  // Apply the wrapper class to the collapse container instead
  vidCollapseContainer.className = "wrapper";

  return vidCollapseContainer;
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
  vidHowManyInput.placeholder = "[Defaults to 1 (most recent)]";

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

//-----------------------------

export const buildVidTypeButtons = async () => {
  const vidTypeButtonContainer = document.createElement("div");
  vidTypeButtonContainer.id = "vid-type-button-container";

  // Only vid pages to start
  const buttonData = [{ buttonValue: "vidPages", buttonText: "KCNA Vid Pages" }];

  // Create button list
  const buttonList = document.createElement("ul");
  buttonList.id = "vid-type-button-list";

  // Build each button
  for (let i = 0; i < buttonData.length; i++) {
    const buttonItem = await buildVidTypeButtonItem(buttonData[i]);
    buttonList.append(buttonItem);
  }

  vidTypeButtonContainer.append(buttonList);
  return vidTypeButtonContainer;
};

export const buildVidTypeButtonItem = async (buttonData) => {
  const { vidType } = stateFront;
  const { buttonValue, buttonText } = buttonData;

  const buttonListItem = document.createElement("li");
  buttonListItem.className = "vid-type-button-item";

  const button = document.createElement("button");
  button.id = `vid-type-button-${buttonValue}`;
  button.className = "vid-type-button";
  button.setAttribute("data-update", `vid-type-button-${buttonValue}`);
  button.innerHTML = buttonText;

  //add active type
  if (vidType === buttonValue) button.classList.add("active");

  buttonListItem.append(button);
  return buttonListItem;
};
