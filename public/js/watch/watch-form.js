import { buildCollapseContainer } from "../util/collapse.js";

//VID FORM ELEMENTS
export const buildWatchForm = async () => {
  const watchWrapper = document.createElement("ul");
  watchWrapper.id = "watch-wrapper";
  watchWrapper.className = "wrapper collapse-content";

  // const vidTypeListItem = await buildVidTypeListItem();
  const watchHowManyListItem = await buildWatchHowManyListItem();
  const watchSortByListItem = await buildWatchSortByListItem();

  watchWrapper.append(watchHowManyListItem, watchSortByListItem);

  const titleElement = document.createElement("div");
  titleElement.textContent = "KCTV";
  // titleElement.setAttribute("data-expand", "vid-dropdown"); //for click listener

  //build collapse container
  const watchCollapseObj = {
    titleElement: titleElement,
    contentElement: watchWrapper,
    isExpanded: false,
    className: "watch-wrapper-collapse",
    dataAttribute: "watch-form-header",
  };

  const watchCollapseContainer = await buildCollapseContainer(watchCollapseObj);

  // Apply the wrapper class to the collapse container instead
  watchCollapseContainer.className = "wrapper";

  return watchCollapseContainer;
};

export const buildWatchHowManyListItem = async () => {
  const watchHowManyListItem = document.createElement("li");
  watchHowManyListItem.id = "watch-how-many-list-item";
  watchHowManyListItem.className = "form";

  const watchHowManyLabel = document.createElement("label");
  watchHowManyLabel.setAttribute("for", "watch-how-many");
  watchHowManyLabel.textContent = "How Many?";

  const watchHowManyInput = document.createElement("input");
  watchHowManyInput.type = "text";
  watchHowManyInput.name = "watch-how-many";
  watchHowManyInput.id = "watch-how-many";
  watchHowManyInput.placeholder = "[Defaults to 2 (most recent)]";

  watchHowManyListItem.append(watchHowManyLabel, watchHowManyInput);

  return watchHowManyListItem;
};

export const buildWatchSortByListItem = async () => {
  const watchSortByListItem = document.createElement("li");
  watchSortByListItem.id = "watch-sort-by-list-item";
  watchSortByListItem.className = "form";

  const watchSortByLabel = document.createElement("label");
  watchSortByLabel.setAttribute("for", "watch-sort-by");
  watchSortByLabel.textContent = "Sort By";

  const watchSortBySelect = document.createElement("select");
  watchSortBySelect.name = "watch-sort-by";
  watchSortBySelect.id = "watch-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "watch-newest-to-oldest", id: "watch-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "watch-oldest-to-newest", id: "watch-oldest-to-newest", text: "Oldest to Newest" },
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
    watchSortBySelect.append(option);
  }

  watchSortByListItem.append(watchSortByLabel, watchSortBySelect);

  return watchSortByListItem;
};
