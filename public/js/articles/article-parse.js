import { buildArticleListItem } from "./article-elements.js";
import { defineCollapseItems } from "../collapse.js";
import { buildInputParams, sendToBack } from "../util.js";

//BUILD DEFAULT ARTICLE DISPLAY
export const buildDefaultArticleDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  console.log("BUILD ARTICLE DISPLAY!!!!!");
  console.log(inputArray);

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

//--------------------------------

//GET NEW ARTICLE DATA
export const buildNewArticleDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;
  //get user input
  // const inputParams = await buildInputParams();
  // if (!inputParams || !inputParams.articleType || !inputParams.articleHowMany || !inputParams.articleSortBy) return null;

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

  const newArticleDataWrapper = await buildArticleDisplay(newArticleData, newArticleInputArray);
  newArticleDataWrapper.classList.remove("hidden");

  //get backend data wrapper and replace old data
  const backendDataWrapper = document.getElementById("backend-data-wrapper");

  //please work
  backendDataWrapper.replaceChild(newArticleDataWrapper, articleArrayElement);

  console.log("BACKEND DATA WRAPPER");
  console.log(backendDataWrapper);

  return true;
};

// Helper function to get current article state from DOM element
export const getCurrentArticleState = (articleElement) => {
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
export const setCurrentArticleState = (articleElement, inputArray) => {
  if (!articleElement || !inputArray || inputArray.length < 3) return;

  const [articleType, articleHowMany, articleSortBy] = inputArray;

  articleElement.setAttribute("data-article-type", articleType);
  articleElement.setAttribute("data-article-how-many", articleHowMany.toString());
  articleElement.setAttribute("data-article-sort-by", articleSortBy);
};
