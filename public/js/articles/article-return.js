import { picDropDownContainer } from "../pics/pic-util.js";
import { defineCollapseItems } from "../collapse.js";
import { setCurrentArticleState } from "./article-data.js";

export const buildArticleReturnDisplay = async (inputArray, stateParams = null) => {
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
  const articlePicData = await picDropDownContainer(picArray, "article");
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
