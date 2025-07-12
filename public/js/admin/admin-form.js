import { buildCollapseContainer } from "../util/collapse.js";

export const buildAdminForm = async () => {
  //create the fucking element
  const adminFormWrapper = document.createElement("ul");
  adminFormWrapper.id = "admin-form-wrapper";
  adminFormWrapper.className = "collapse-content";

  const appListItem = await buildAppListItem();
  const commandListItem = await buildCommandListItem();
  const howMuchListItem = await buildHowMuchListItem();
  const urlListItem = await buildUrlListItem();
  const itemTypeListItem = await buildItemTypeListItem();
  const articleTypeListItem = await buildArticleTypeListItem();
  const uploadTgListItem = await buildUploadTgListItem();
  const tgIdListItem = await buildTgIdListItem();
  const buttonListItem = await buildButtonListItem();

  //append everything
  adminFormWrapper.append(
    appListItem,
    commandListItem,
    howMuchListItem,
    urlListItem,
    itemTypeListItem,
    articleTypeListItem,
    uploadTgListItem,
    tgIdListItem,
    buttonListItem
  );

  //MAKE IT COLLAPSE HERE
  const titleElement = document.createElement("div");
  titleElement.textContent = "ADMIN FORM";
  titleElement.className = "collapse-header admin-form-title";
  // titleElement.setAttribute("data-expand", "article-dropdown"); //for click listener

  //build collapse container
  const adminFormCollapseParams = {
    titleElement: titleElement,
    contentElement: adminFormWrapper,
    isExpanded: true,
    className: "admin-form-wrapper-collapse",
    dataAttribute: "admin-form-header",
  };

  const adminFormCollapseContainer = await buildCollapseContainer(adminFormCollapseParams);
  adminFormCollapseContainer.className = "wrapper";

  return adminFormCollapseContainer;
};

export const buildAppListItem = async () => {
  const appListItem = document.createElement("li");
  appListItem.id = "admin-app-list-item";

  const appLabel = document.createElement("label");
  appLabel.setAttribute("for", "admin-app-type");
  appLabel.textContent = "App Type";

  const appSelect = document.createElement("select");
  appSelect.name = "admin-app-type";
  appSelect.id = "admin-app-type";

  const appOptionArray = [
    { value: "admin-scraper", id: "admin-scraper", text: "Scraper", selected: true },
    { value: "admin-kcna-watch", id: "admin-kcna-watch", text: "KCNA Watch" },
  ];

  for (let i = 0; i < appOptionArray.length; i++) {
    const optionData = appOptionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    appSelect.append(option);
  }

  appListItem.appendChild(appLabel);
  appListItem.appendChild(appSelect);

  return appListItem;
};

export const buildCommandListItem = async () => {
  // Create Command list item
  const commandListItem = document.createElement("li");
  commandListItem.id = "admin-command-list-item";

  const commandLabel = document.createElement("label");
  commandLabel.setAttribute("for", "admin-command-type");
  commandLabel.textContent = "Command";

  const commandSelect = document.createElement("select");
  commandSelect.name = "admin-command-type";
  commandSelect.id = "admin-command-type";

  // Command select options
  const commandOptionArray = [
    { value: "admin-start-scrape", id: "admin-start-scrape", text: "Scrape Start", selected: true },
    { value: "admin-stop-scrape", id: "admin-stop-scrape", text: "Scrape Stop" },
    { value: "admin-start-scheduler", id: "admin-start-scheduler", text: "Scheduler ON" },
    { value: "admin-stop-scheduler", id: "admin-stop-scheduler", text: "Scheduler OFF" },
    { value: "admin-scrape-status", id: "admin-scrape-status", text: "Get Scrape Status" },
  ];

  for (let i = 0; i < commandOptionArray.length; i++) {
    const optionData = commandOptionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    commandSelect.append(option);
  }

  commandListItem.appendChild(commandLabel);
  commandListItem.appendChild(commandSelect);

  return commandListItem;
};

export const buildHowMuchListItem = async () => {
  // Create How Much list item
  const howMuchListItem = document.createElement("li");
  howMuchListItem.id = "admin-how-much-list-item";

  const howMuchLabel = document.createElement("label");
  howMuchLabel.setAttribute("for", "admin-how-much");
  howMuchLabel.textContent = "How Much?";

  const howMuchSelect = document.createElement("select");
  howMuchSelect.name = "admin-how-much";
  howMuchSelect.id = "admin-how-much";

  // How Much select options
  const howMuchOptionArray = [
    { value: "admin-scrape-new", id: "admin-scrape-new", text: "Scrape NEW", selected: true },
    { value: "admin-scrape-all", id: "admin-scrape-all", text: "Scrape ALL" },
    { value: "admin-scrape-url", id: "admin-scrape-url", text: "Scrape URL" },
  ];

  for (let i = 0; i < howMuchOptionArray.length; i++) {
    const optionData = howMuchOptionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    howMuchSelect.append(option);
  }

  howMuchListItem.appendChild(howMuchLabel);
  howMuchListItem.appendChild(howMuchSelect);

  return howMuchListItem;
};

export const buildUrlListItem = async () => {
  // Create URL input (hidden)
  const urlListItem = document.createElement("li");
  urlListItem.id = "admin-url-input-list-item";
  urlListItem.className = "hidden";

  const urlLabel = document.createElement("label");
  urlLabel.setAttribute("for", "admin-url-input");
  urlLabel.textContent = "URL";

  const urlInput = document.createElement("input");
  urlInput.type = "text";
  urlInput.name = "admin-url-input";
  urlInput.id = "admin-url-input";

  urlListItem.appendChild(urlLabel);
  urlListItem.appendChild(urlInput);

  return urlListItem;
};

export const buildItemTypeListItem = async () => {
  // Create Item Type list item
  const itemTypeListItem = document.createElement("li");
  itemTypeListItem.id = "admin-item-type-list-item";

  const itemTypeLabel = document.createElement("label");
  itemTypeLabel.setAttribute("for", "admin-item-type");
  itemTypeLabel.textContent = "Item Type";

  const itemTypeSelect = document.createElement("select");
  itemTypeSelect.name = "admin-item-type";
  itemTypeSelect.id = "admin-item-type";

  // Item Type select options
  const itemTypeOptionArray = [
    { value: "admin-everything-select", id: "admin-everything-select", text: "Everything", selected: true },
    { value: "admin-articles-select", id: "admin-articles-select", text: "Just Articles" },
    { value: "admin-picSets-select", id: "admin-picSets-select", text: "Just Pic Sets" },
    { value: "admin-vidPages-select", id: "admin-vidPages-select", text: "Just Vid Pages" },
  ];

  for (let i = 0; i < itemTypeOptionArray.length; i++) {
    const optionData = itemTypeOptionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    itemTypeSelect.append(option);
  }

  itemTypeListItem.appendChild(itemTypeLabel);
  itemTypeListItem.appendChild(itemTypeSelect);

  return itemTypeListItem;
};

export const buildArticleTypeListItem = async () => {
  // Create Article Type list item (hidden)
  const articleTypeListItem = document.createElement("li");
  articleTypeListItem.id = "admin-article-type-list-item";
  articleTypeListItem.className = "hidden";

  const articleTypeLabel = document.createElement("label");
  articleTypeLabel.setAttribute("for", "admin-article-type");
  articleTypeLabel.textContent = "Article Type";

  const articleTypeSelect = document.createElement("select");
  articleTypeSelect.name = "admin-article-type";
  articleTypeSelect.id = "admin-article-type";

  // Article Type select options
  const articleTypeOptionArray = [
    { value: "admin-all-type", id: "admin-all-type", text: "All", selected: true },
    { value: "admin-fatboy", id: "admin-fatboy", text: "Revolutionary Activities" },
    { value: "admin-top-news", id: "admin-top-news", text: "Top News" },
    { value: "admin-latest-news", id: "admin-latest-news", text: "Latest News" },
    { value: "admin-external-news", id: "admin-external-news", text: "External News" },
    { value: "admin-anecdote", id: "admin-anecdote", text: "Revolutionary Anecdotes" },
    { value: "admin-people", id: "admin-people", text: "Always in Memory of the People" },
  ];

  for (let i = 0; i < articleTypeOptionArray.length; i++) {
    const optionData = articleTypeOptionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    articleTypeSelect.append(option);
  }

  articleTypeListItem.appendChild(articleTypeLabel);
  articleTypeListItem.appendChild(articleTypeSelect);

  return articleTypeListItem;
};

export const buildUploadTgListItem = async () => {
  // Create Upload TG list item
  const uploadTgListItem = document.createElement("li");
  uploadTgListItem.id = "admin-upload-tg-list-item";

  const uploadTgLabel = document.createElement("label");
  uploadTgLabel.setAttribute("for", "admin-upload-tg");
  uploadTgLabel.textContent = "Upload TG";

  const uploadTgSelect = document.createElement("select");
  uploadTgSelect.name = "admin-upload-tg";
  uploadTgSelect.id = "admin-upload-tg";

  // Upload TG select options
  const uploadTgOptionArray = [
    { value: "admin-yes-tg", id: "admin-yes-tg", text: "Yes", selected: true },
    { value: "admin-no-tg", id: "admin-no-tg", text: "No" },
  ];

  for (let i = 0; i < uploadTgOptionArray.length; i++) {
    const optionData = uploadTgOptionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    uploadTgSelect.append(option);
  }

  uploadTgListItem.appendChild(uploadTgLabel);
  uploadTgListItem.appendChild(uploadTgSelect);

  return uploadTgListItem;
};

export const buildTgIdListItem = async () => {
  // Create TG Chat ID input
  const tgIdListItem = document.createElement("li");
  tgIdListItem.id = "admin-tgId-list-item";

  const tgIdLabel = document.createElement("label");
  tgIdLabel.setAttribute("for", "admin-tgId");
  tgIdLabel.textContent = "TG Chat ID";

  const tgIdInput = document.createElement("input");
  tgIdInput.type = "text";
  tgIdInput.name = "admin-tgId";
  tgIdInput.id = "admin-tgId";

  tgIdListItem.appendChild(tgIdLabel);
  tgIdListItem.appendChild(tgIdInput);

  return tgIdListItem;
};

export const buildButtonListItem = async () => {
  // Create submit button
  const button = document.createElement("button");
  button.id = "admin-submit-button";
  button.textContent = "Submit";
  button.setAttribute("type", "submit");

  // Create list item for button
  const buttonListItem = document.createElement("li");
  buttonListItem.id = "admin-submit-list-item";
  buttonListItem.appendChild(button);

  return buttonListItem;
};
