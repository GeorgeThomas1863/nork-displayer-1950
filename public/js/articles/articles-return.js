import { picDropDownContainer } from "../pics/pics-return.js";
import { buildCollapseContainer, defineCollapseItems } from "../util/collapse-display.js";

//BUILD DEFAULT ARTICLE DISPLAY
export const buildArticlesReturnDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  // Create a container div that will hold both buttons and article list
  const articleDisplayContainer = document.createElement("div");
  articleDisplayContainer.id = "article-display-container";

  // Add the article type buttons at the top
  const articleButtonsElement = await buildArticleTypeButtons();
  articleDisplayContainer.append(articleButtonsElement);

  const articleList = document.createElement("ul");
  articleList.id = "article-array-element";
  articleList.className = "article-list data-return";

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

  articleDisplayContainer.append(articleList);

  return articleDisplayContainer;
};

export const buildArticleListItem = async (inputObj, isFirst) => {
  const { title, date } = inputObj;

  const articleListItem = document.createElement("li");
  articleListItem.className = "article-list-item wrapper";

  // Create the article element (now includes pictures inside)
  const articleContainer = await buildArticleContainer(inputObj);

  //build title element
  const dateElement = await buildArticleDate(date);
  const titleElement = await buildArticleTitle(title);
  titleElement.innerHTML = `${titleElement.textContent} <span>[${dateElement.textContent}]</span>`;

  // Wrap the article content in a collapsible
  const articleCollapseObj = {
    titleElement: titleElement,
    contentElement: articleContainer,
    isExpanded: isFirst,
    className: "article-element-collapse",
  };

  const articleCollapseContainer = await buildCollapseContainer(articleCollapseObj);
  articleListItem.append(articleCollapseContainer);

  return articleListItem;
};

//holds article and pics (if present)
export const buildArticleContainer = async (inputObj) => {
  const { picArray } = inputObj;

  const articleContainer = document.createElement("div");
  articleContainer.id = "article-container-element";

  //Add pics as collapse (if present)
  const articlePicData = await picDropDownContainer(picArray, "article");
  if (articlePicData) {
    articleContainer.append(articlePicData);
  }

  const articleElement = await buildArticleElement(inputObj);
  articleContainer.append(articleElement);

  return articleContainer;
};

export const buildArticleElement = async (inputObj) => {
  const { date, text } = inputObj;

  const articleElement = document.createElement("article");
  articleElement.id = "article-element";

  // Then append date and text after pictures (title is handled by collapse header)
  const dateElement = await buildArticleDate(date);
  const textElement = await buildArticleText(text);

  articleElement.append(dateElement, textElement);

  return articleElement;
};

export const buildArticleTitle = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "article-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildArticleDate = async (date) => {
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

export const buildArticleText = async (text) => {
  if (!text) return null;

  const textElement = document.createElement("div");
  textElement.id = "article-text";

  // Fix line breaks by replacing \n with <br> tags
  const textWithBreaks = text.replace(/\n/g, "<br>");
  textElement.innerHTML = textWithBreaks;

  return textElement;
};
