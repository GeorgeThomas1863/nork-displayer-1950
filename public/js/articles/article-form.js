import { buildCollapseContainer } from "../util/collapse.js";

//ARTICLE FORM ELEMENTS
export const buildArticleForm = async () => {
  const articleWrapper = document.createElement("ul");
  articleWrapper.id = "article-wrapper";
  articleWrapper.className = "wrapper collapse-content";

  //build FORM list items
  // const articleTypeListItem = await buildArticleTypeListItem();
  const articleHowManyListItem = await buildArticleHowManyListItem();
  const articleSortByListItem = await buildArticleSortByListItem();

  articleWrapper.append(articleHowManyListItem, articleSortByListItem);

  // create title element for collapse container
  const titleElement = document.createElement("div");
  titleElement.textContent = "ARTICLES";
  // titleElement.setAttribute("data-expand", "article-dropdown"); //for click listener

  //build collapse container
  const articleCollapseObj = {
    titleElement: titleElement,
    contentElement: articleWrapper,
    isExpanded: true,
    className: "article-wrapper-collapse",
    dataAttribute: "article-form-header",
  };

  const articleCollapseContainer = await buildCollapseContainer(articleCollapseObj);

  // Apply the wrapper class to the collapse container instead
  articleCollapseContainer.className = "wrapper";

  return articleCollapseContainer;
};

export const buildArticleHowManyListItem = async () => {
  const articleHowManyListItem = document.createElement("li");
  articleHowManyListItem.id = "article-how-many-list-item";
  articleHowManyListItem.className = "form";

  const articleHowManyLabel = document.createElement("label");
  articleHowManyLabel.setAttribute("for", "article-how-many");
  articleHowManyLabel.textContent = "How Many?";

  const articleHowManyInput = document.createElement("input");
  articleHowManyInput.type = "text";
  articleHowManyInput.name = "article-how-many";
  articleHowManyInput.id = "article-how-many";
  articleHowManyInput.placeholder = "[Defaults to 5 (most recent)]";

  articleHowManyListItem.append(articleHowManyLabel, articleHowManyInput);

  return articleHowManyListItem;
};

export const buildArticleSortByListItem = async () => {
  const articleSortByListItem = document.createElement("li");
  articleSortByListItem.id = "article-sort-by-list-item";
  articleSortByListItem.className = "form";

  const articleSortByLabel = document.createElement("label");
  articleSortByLabel.setAttribute("for", "article-sort-by");
  articleSortByLabel.textContent = "Sort By";

  const articleSortBySelect = document.createElement("select");
  articleSortBySelect.name = "article-sort-by";
  articleSortBySelect.id = "article-sort-by";

  // Create options for sort by select
  const optionArray = [
    { value: "article-newest-to-oldest", id: "article-newest-to-oldest", text: "Newest to Oldest", selected: true },
    { value: "article-oldest-to-newest", id: "article-oldest-to-newest", text: "Oldest to Newest" },
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
    articleSortBySelect.append(option);
  }

  articleSortByListItem.append(articleSortByLabel, articleSortBySelect);

  return articleSortByListItem;
};

//-----------------------

export const buildArticleTypeButtons = async () => {
  const articleTypeButtonContainer = document.createElement("div");
  articleTypeButtonContainer.id = "article-type-button-container";

  // Define button data matching your dropdown options
  const buttonData = [
    { value: "fatboy", text: `"Revolutionary Activities" [KJU sh*t]`, active: true },
    { value: "all-type", text: "ALL ARTICLES" },
    { value: "top", text: "Top News" },
    { value: "latest", text: "Latest News" },
    { value: "external", text: "External News" },
    { value: "anecdote", text: "Revolutionary Anecdotes" },
    { value: "people", text: "Always in Memory of the People" },
  ];

  // Create button list
  const buttonList = document.createElement("ul");
  buttonList.id = "article-type-button-list";

  // Build each button
  for (let i = 0; i < buttonData.length; i++) {
    const buttonItem = await buildArticleTypeButtonItem(buttonData[i]);
    buttonList.append(buttonItem);
  }

  articleTypeButtonContainer.append(buttonList);
  return articleTypeButtonContainer;
};

export const buildArticleTypeButtonItem = async (buttonData) => {
  const buttonListItem = document.createElement("li");
  buttonListItem.className = "article-type-button-item";

  const button = document.createElement("button");
  button.className = "article-type-button";
  button.setAttribute("data-article-type", buttonData.value);
  button.innerHTML = buttonData.text;

  // // // Set active state if specified
  // if (buttonData.active) {
  //   button.classList.add("active");
  // }

  // // Add click handler
  // button.addEventListener("click", handleArticleTypeButtonClick);

  buttonListItem.append(button);
  return buttonListItem;
};
