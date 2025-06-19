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
  picHowManyInput.placeholder = "[Defaults to 6 (most recent)]";

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
