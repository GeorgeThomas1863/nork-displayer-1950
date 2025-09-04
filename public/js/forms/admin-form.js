import { buildCollapseContainer } from "../util/collapse.js";

export const buildAdminForm = async () => {
  const adminFormWrapper = document.createElement("ul");
  adminFormWrapper.id = "admin-form-wrapper";
  adminFormWrapper.className = "collapse-content";

  const appListItem = await buildAppListItem();
  const commandListItem = await buildCommandListItem();
  const howMuchListItem = await buildHowMuchListItem();
  const buttonListItem = await buildButtonListItem();

  //append everything
  adminFormWrapper.append(appListItem, commandListItem, howMuchListItem, buttonListItem);

  //MAKE IT COLLAPSE HERE
  const titleElement = document.createElement("div");
  titleElement.textContent = "ADMIN FORM";
  titleElement.className = "collapse-header admin-form-title";

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
    {
      value: "admin-scraper",
      id: "admin-scraper",
      text: "Scraper",
      selected: true,
    },
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
    {
      value: "admin-start-scrape",
      id: "admin-start-scrape",
      text: "Scrape Start",
      selected: true,
    },
    {
      value: "admin-stop-scrape",
      id: "admin-stop-scrape",
      text: "Scrape Stop",
    },
    {
      value: "admin-start-scheduler",
      id: "admin-start-scheduler",
      text: "Scheduler ON",
    },
    {
      value: "admin-stop-scheduler",
      id: "admin-stop-scheduler",
      text: "Scheduler OFF",
    },
    {
      value: "admin-scrape-status",
      id: "admin-scrape-status",
      text: "Get Scrape Status",
    },
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
