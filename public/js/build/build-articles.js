import { buildArticlePicData } from "./build-pics.js";
import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";
import { buildInputParams, sendToBack } from "../util.js";

//includes FORM and DATA RETURN
export const buildArticleForm = async () => {
  const articleWrapper = document.createElement("ul");
  articleWrapper.id = "article-wrapper";
  articleWrapper.className = "wrapper collapse-content";

  //build FORM list items
  const articleTypeListItem = await buildArticleTypeListItem();
  const articleHowManyListItem = await buildArticleHowManyListItem();
  const articleSortByListItem = await buildArticleSortByListItem();

  articleWrapper.append(articleTypeListItem, articleHowManyListItem, articleSortByListItem);

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

export const buildArticleTypeListItem = async () => {
  const articleTypeListItem = document.createElement("li");
  articleTypeListItem.id = "article-type-list-item";
  articleTypeListItem.className = "form";

  const articleTypeLabel = document.createElement("label");
  articleTypeLabel.setAttribute("for", "article-type");
  articleTypeLabel.textContent = "Article Type";

  const articleTypeSelect = document.createElement("select");
  articleTypeSelect.name = "article-type";
  articleTypeSelect.id = "article-type";

  // Create options for article type select
  const optionArray = [
    { value: "fatboy", id: "fatboy", text: `"Revolutionary Activities"`, selected: true },
    { value: "all-type", id: "all-type", text: "All" },
    { value: "top", id: "top", text: "Top News" },
    { value: "latest", id: "latest", text: "Latest News" },
    { value: "external", id: "external", text: "External News" },
    { value: "anecdote", id: "anecdote", text: "Revolutionary Anecdotes" },
    { value: "people", id: "people", text: "Always in Memory of the People" },
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
    articleTypeSelect.append(option);
  }

  articleTypeListItem.append(articleTypeLabel, articleTypeSelect);

  return articleTypeListItem;
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

//--------------------------------------

export const buildArticleData = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  const articleList = document.createElement("ul");
  articleList.id = "article-array-element";
  articleList.className = "article-list data-return";
  articleList.className = "hidden";

  // Set initial state attributes if provided
  if (stateParams) {
    setCurrentArticleState(articleList, stateParams);
  } else {
    // Set default state for initial load
    const defaultState = ["fatboy", 5, "article-newest-to-oldest"];
    setCurrentArticleState(articleList, defaultState);
  }

  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < inputArray.length; i++) {
    const articleListItem = await buildArticleListItem(inputArray[i], isFirst);
    articleList.append(articleListItem);

    // Store the collapse components for group functionality
    const collapseItem = articleListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);

    isFirst = false;
  }

  // Set up the collapse group behavior
  await defineCollapseItems(collapseArray);

  return articleList;
};

export const buildArticleListItem = async (inputObj, isFirst) => {
  const { title } = inputObj;

  const articleListItem = document.createElement("li");
  articleListItem.className = "article-list-item";

  // Create the article element (now includes pictures inside)
  const articleElement = await buildArticleElement(inputObj);

  //build title element
  const titleElement = await buildTitle(title);

  // Wrap the article content in a collapsible
  const articleCollapseObj = {
    titleElement: titleElement,
    contentElement: articleElement,
    isExpanded: isFirst,
    className: "article-element-collapse",
  };

  const articleCollapseContainer = await buildCollapseContainer(articleCollapseObj);
  articleListItem.append(articleCollapseContainer);

  return articleListItem;
};

export const buildArticleElement = async (inputObj) => {
  const { date, text, picArray } = inputObj;

  const articleElement = document.createElement("article");
  articleElement.id = "article-element";

  //Add pics as collapse
  const articlePicData = await buildArticlePicData(picArray);
  if (articlePicData) {
    articleElement.append(articlePicData);
  }

  // Then append date and text after pictures (title is handled by collapse header)
  const dateElement = await buildDate(date);
  const textElement = await buildText(text);

  articleElement.append(dateElement, textElement);

  return articleElement;
};

export const buildTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "article-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildDate = async (date) => {
  // Format and append date
  const dateElement = document.createElement("div");
  dateElement.id = "article-date";
  const dateObj = new Date(date);
  dateElement.textContent = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return dateElement;
};

export const buildText = async (text) => {
  if (!text) return null;

  const textElement = document.createElement("div");
  textElement.id = "article-text";

  // Fix line breaks by replacing \n with <br> tags
  const textWithBreaks = text.replace(/\n/g, "<br>");
  textElement.innerHTML = textWithBreaks;

  return textElement;
};

//--------------------------------------

//GET NEW DATA SECTION
export const getNewArticleData = async () => {
  //get user input
  const inputParams = await buildInputParams();
  if (!inputParams || !inputParams.articleType || !inputParams.articleHowMany || !inputParams.articleSortBy) return null;

  // Extract article inputs
  const { articleType, articleHowMany, articleSortBy } = inputParams;
  const newArticleInputArray = [articleType, articleHowMany, articleSortBy];

  // Get current data state from the existing article array element
  const articleArrayElement = document.getElementById("article-array-element");
  const currentArticleInputArray = getCurrentArticleState(articleArrayElement);

  // Compare new input against current state, not hardcoded defaults
  let needsNewData = false;
  for (let i = 0; i < currentArticleInputArray.length; i++) {
    if (currentArticleInputArray[i] !== newArticleInputArray[i]) {
      needsNewData = true;
      break;
    }
  }

  // If no change needed, return early
  if (!needsNewData) {
    console.log("Article data unchanged, skipping backend request");
    console.log("Current state:", currentArticleInputArray);
    console.log("New input:", newArticleInputArray);
    return false;
  }

  console.log("Article parameters changed - fetching new data");
  console.log("Previous state:", currentArticleInputArray);
  console.log("New state:", newArticleInputArray);

  //set route and fetch new data
  inputParams.route = "/get-new-article-data-route";
  const newArticleData = await sendToBack(inputParams);

  if (!newArticleData) return null;

  const newArticleDataWrapper = await buildArticleData(newArticleData, newArticleInputArray);

  //get backend data wrapper and replace old data
  const backendDataWrapper = document.getElementById("backend-data-wrapper");

  //please work
  backendDataWrapper.replaceChild(newArticleDataWrapper, articleArrayElement);

  console.log("BACKEND DATA WRAPPER");
  console.log(backendDataWrapper);

  return true;
};

// Helper function to get current article state from DOM element
const getCurrentArticleState = (articleElement) => {
  if (!articleElement) {
    // If no element exists, return initial default state
    return ["fatboy", 5, "article-newest-to-oldest"];
  }

  const articleType = articleElement.getAttribute("data-article-type") || "fatboy";
  const articleHowMany = parseInt(articleElement.getAttribute("data-article-how-many")) || 5;
  const articleSortBy = articleElement.getAttribute("data-article-sort-by") || "article-newest-to-oldest";

  return [articleType, articleHowMany, articleSortBy];
};

// Helper function to store current article state on DOM element
const setCurrentArticleState = (articleElement, inputArray) => {
  if (!articleElement || !inputArray || inputArray.length < 3) return;

  const [articleType, articleHowMany, articleSortBy] = inputArray;

  articleElement.setAttribute("data-article-type", articleType);
  articleElement.setAttribute("data-article-how-many", articleHowMany.toString());
  articleElement.setAttribute("data-article-sort-by", articleSortBy);
};
