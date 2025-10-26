import { buildCollapseContainer } from "../util/collapse-display.js";

export const buildAdminForm = async () => {
  const adminFormOverallWrapper = document.createElement("div");
  adminFormOverallWrapper.id = "admin-form-overall-wrapper";

  const adminFormWrapper = document.createElement("ul");
  adminFormWrapper.id = "admin-form-wrapper";

  const commandListItem = await buildCommandListItem();
  const targetListItem = await buildTargetListItem();
  const howMuchListItem = await buildHowMuchListItem();
  const urlListItem = await buildUrlListItem();
  const buttonListItem = await buildButtonListItem();

  //append everything
  adminFormWrapper.append(commandListItem, targetListItem, howMuchListItem, urlListItem, buttonListItem);

  //MAKE IT COLLAPSE HERE
  const titleElement = document.createElement("div");
  titleElement.textContent = "ADMIN FORM CONTROL";
  titleElement.className = "collapse-header admin-form-title";

  //build collapse container
  const adminFormCollapseParams = {
    titleElement: titleElement,
    contentElement: adminFormWrapper,
    isExpanded: true,
    className: "admin-form-collapse",
    dataAttribute: "admin-form-header",
  };

  const adminFormCollapseContainer = await buildCollapseContainer(adminFormCollapseParams);
  adminFormCollapseContainer.className = "wrapper";
  adminFormCollapseContainer.id = "admin-form-collapse-container";

  //build update button
  const adminUpdateDataButton = await buildAdminUpdateDataButton();

  adminFormOverallWrapper.append(adminFormCollapseContainer, adminUpdateDataButton);

  return adminFormOverallWrapper;
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

export const buildTargetListItem = async () => {
  const targetListItem = document.createElement("li");
  targetListItem.id = "admin-target-list-item";

  const targetLabel = document.createElement("label");
  targetLabel.setAttribute("for", "admin-target-type");
  targetLabel.textContent = "Target Site";

  const targetSelect = document.createElement("select");
  targetSelect.name = "admin-target-type";
  targetSelect.id = "admin-target-type";

  const targetOptionArray = [
    { value: "kcna", id: "kcna", text: "KCNA", selected: true },
    { value: "watch", id: "watch", text: "KCNA Watch" },
  ];

  for (let i = 0; i < targetOptionArray.length; i++) {
    const optionData = targetOptionArray[i];
    const option = document.createElement("option");
    option.value = optionData.value;
    option.id = optionData.id;
    option.textContent = optionData.text;
    if (optionData.selected) {
      option.selected = true;
    }
    targetSelect.append(option);
  }

  targetListItem.appendChild(targetLabel);
  targetListItem.appendChild(targetSelect);

  return targetListItem;
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
    {
      value: "admin-scrape-new",
      id: "admin-scrape-new",
      text: "Scrape NEW",
      selected: true,
    },
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

export const buildButtonListItem = async () => {
  // Create submit button
  const button = document.createElement("button");
  button.id = "admin-submit-button";
  button.className = "btn-submit";
  button.textContent = "Submit";
  button.setAttribute("data-label", "admin-command-submit");

  // Create list item for button
  const buttonListItem = document.createElement("li");
  buttonListItem.id = "admin-submit-list-item";
  buttonListItem.appendChild(button);

  return buttonListItem;
};

//-----------------------

export const buildAdminUpdateDataButton = async () => {
  const adminUpdateDataButtonWrapper = document.createElement("div");
  adminUpdateDataButtonWrapper.id = "admin-update-data-button-wrapper";

  const adminUpdateDataButton = document.createElement("button");
  adminUpdateDataButton.id = "admin-update-data-button";
  adminUpdateDataButton.textContent = "Update Mongo Data";
  adminUpdateDataButton.className = "btn-submit";
  adminUpdateDataButton.setAttribute("data-label", "admin-update-data-button");

  adminUpdateDataButtonWrapper.append(adminUpdateDataButton);
  return adminUpdateDataButtonWrapper;
};
