import { buildCollapseContainer } from "../collapse.js";

export const buildVidPageForm = async () => {
  const vidPageWrapper = document.createElement("ul");
  vidPageWrapper.id = "vid-page-wrapper";
  vidPageWrapper.className = "wrapper collapse-content";

  const vidPageHowManyListItem = await buildVidPageHowManyListItem();
  const vidPageSortByListItem = await buildVidPageSortByListItem();

  vidPageWrapper.append(vidPageHowManyListItem, vidPageSortByListItem);

  const titleElement = document.createElement("div");
  titleElement.textContent = "VIDS";

  //build collapse container
  const vidPageCollapseObj = {
    titleElement: titleElement,
    contentElement: vidPageWrapper,
    isExpanded: true,
    className: "vid-page-wrapper-collapse",
  };

  const vidPageCollapseContainer = await buildCollapseContainer(vidPageCollapseObj);

  // Apply the wrapper class to the collapse container instead
  vidPageCollapseContainer.className = "wrapper";

  return vidPageCollapseContainer;
};

export const buildVidPageHowManyListItem = async () => {
  const vidPageHowManyListItem = document.createElement("li");
  vidPageHowManyListItem.id = "vid-page-how-many-list-item";
  vidPageHowManyListItem.className = "form";

  const vidPageHowManyLabel = document.createElement("label");
  vidPageHowManyLabel.setAttribute("for", "vid-page-how-many");
  vidPageHowManyLabel.textContent = "How Many?";

  const vidPageHowManyInput = document.createElement("input");
  vidPageHowManyInput.type = "text";
  vidPageHowManyInput.name = "vid-page-how-many";
  vidPageHowManyInput.id = "vid-page-how-many";
  vidPageHowManyInput.placeholder = "[Defaults to 5 (most recent)]";

  vidPageHowManyListItem.append(vidPageHowManyLabel, vidPageHowManyInput);

  return vidPageHowManyListItem;
};

export const buildVidPageSortByListItem = async () => {
  const vidPageSortByListItem = document.createElement("li");
  vidPageSortByListItem.id = "vid-page-sort-by-list-item";
  vidPageSortByListItem.className = "form";

  const vidPageSortByLabel = document.createElement("label");
  vidPageSortByLabel.setAttribute("for", "vid-page-sort-by");
  vidPageSortByLabel.textContent = "Sort By";

  const vidPageSortBySelect = document.createElement("select");
  vidPageSortBySelect.name = "vid-page-sort-by";
  vidPageSortBySelect.id = "vid-page-sort-by";

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
    vidPageSortBySelect.append(option);
  }

  vidPageSortByListItem.append(vidPageSortByLabel, vidPageSortBySelect);

  return vidPageSortByListItem;
};

//----------------------------

export const buildVidPageData = async (inputArray) => {
  console.log("BUILD");
};
