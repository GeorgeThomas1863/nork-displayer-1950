import { buildPicArrayElement } from "./parse-pics.js";
import { buildCollapseContainer, defineCollapseItems } from "../collapse.js";

//includes FORM and DATA RETURN
export const buildArticleWrapper = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const articleWrapper = document.createElement("ul");
  articleWrapper.id = "article-wrapper";
  articleWrapper.className = "wrapper collapse-content";

  //build FORM list items
  const articleTypeListItem = await buildArticleTypeListItem();
  const articleHowManyListItem = await buildArticleHowManyListItem();
  const articleSortByListItem = await buildArticleSortByListItem();

  const backendArticleData = await parseArticleData(inputArray);
  articleWrapper.append(articleTypeListItem, articleHowManyListItem, articleSortByListItem, backendArticleData);

  // //DELETE LATER
  // articleWrapper.append(articleTypeListItem, articleHowManyListItem, articleSortByListItem);

  // create title element for collapse container
  const titleElement = document.createElement("div");
  titleElement.textContent = "ARTICLES";

  //build collapse container
  const articleCollapseObj = {
    titleElement: titleElement,
    contentElement: articleWrapper,
    isExpanded: true,
    className: "article-wrapper-collapse",
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
  // articleTypeLabel.className = "form";

  const articleTypeSelect = document.createElement("select");
  articleTypeSelect.name = "article-type";
  articleTypeSelect.id = "article-type";
  // articleTypeSelect.className = "form";

  // Create options for article type select
  const optionArray = [
    { value: "fatboy", id: "fatboy", text: "Revolutionary Activities", selected: true },
    { value: "all-type", id: "all-type", text: "All" },
    { value: "top-news", id: "top-news", text: "Top News" },
    { value: "latest-news", id: "latest-news", text: "Latest News" },
    { value: "external-news", id: "external-news", text: "External News" },
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

export const parseArticleData = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const articleList = document.createElement("ul");
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
  defineCollapseItems(collapseArray);

  return articleList;
};

export const buildArticleListItem = async (inputObj, isFirst) => {
  const { title } = inputObj;

  const articleListItem = document.createElement("li");
  articleListItem.className = "article-list-item";

  // Create the article element (now includes pictures inside)
  const articleElement = await buildArticleElement(inputObj);

  //build title element
  const titleElement = await buildTitleElement(title);

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
  // articleElement.className = "article-element";
  articleElement.id = "article-element";

  // Add pictures directly without collapse if they exist
  if (picArray && picArray.length) {
    const picArrayElement = await buildPicArrayElement(picArray);

    if (picArrayElement) {
      // Add a simple header to indicate pictures
      const picHeader = document.createElement("div");
      picHeader.className = "article-pic-header";
      picHeader.textContent = `${picArray.length} Picture${picArray.length > 1 ? "s" : ""}`;

      articleElement.append(picHeader, picArrayElement);
    }
  }

  // Then append date and text after pictures (title is handled by collapse header)
  const dateElement = await buildDateElement(date);
  const textElement = await buildTextElement(text);

  articleElement.append(dateElement, textElement);

  return articleElement;
};

export const buildTitleElement = async (title) => {
  const titleElement = document.createElement("h2");
  titleElement.id = "article-title";
  titleElement.textContent = title;

  return titleElement;
};

export const buildDateElement = async (date) => {
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

export const buildTextElement = async (text) => {
  if (!text) return null;

  const textElement = document.createElement("div");
  textElement.id = "article-text";

  // Fix line breaks by replacing \n with <br> tags
  const textWithBreaks = text.replace(/\n/g, "<br>");
  textElement.innerHTML = textWithBreaks;

  return textElement;
};
