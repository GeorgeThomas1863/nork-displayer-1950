import { buildCollapseContainer } from "../util/collapse-display.js";

const adminFormOverallWrapper = document.getElementById("admin-form-overall-wrapper");

export const buildAdminStatusDisplay = async (inputData) => {
  if (!inputData) return null;
  const { scrapeActive, schedulerActive, scrapeLengthSeconds, scrapeMessage, scrapeId } = inputData;

  console.log("ADMIN STATUS DATA");
  console.dir(inputData);

  //remove existing data
  const currentAdminStatusElement = document.getElementById("admin-status-collapse-container");
  if (currentAdminStatusElement) currentAdminStatusElement.remove();

  const adminStatusWrapper = document.createElement("ul");
  adminStatusWrapper.id = "admin-status-wrapper";

  const scrapeMessageListItem = await buildScrapeMessageListItem(scrapeMessage);
  const scrapeIdListItem = await buildScrapeIdListItem(scrapeId);
  const scrapeStatusListItem = await buildScrapeStatusListItem(scrapeActive);
  const schedulerStatusListItem = await buildSchedulerStatusListItem(schedulerActive);
  const scrapeLengthSecondsListItem = await buildScrapeLengthSecondsListItem(scrapeLengthSeconds);

  adminStatusWrapper.append(scrapeMessageListItem, scrapeIdListItem, scrapeStatusListItem, schedulerStatusListItem, scrapeLengthSecondsListItem);

  const statsTitleElement = document.createElement("div");
  statsTitleElement.textContent = "SCRAPE STATUS";
  statsTitleElement.className = "admin-stats-title";

  const adminStatusCollapseParams = {
    titleElement: statsTitleElement,
    contentElement: adminStatusWrapper,
    isExpanded: true,
    className: "admin-status-collapse",
    dataAttribute: "admin-status-header",
  };

  const adminStatusCollapseContainer = await buildCollapseContainer(adminStatusCollapseParams);
  adminStatusCollapseContainer.id = "admin-status-collapse-container";

  adminFormOverallWrapper.append(adminStatusCollapseContainer);

  return adminFormOverallWrapper;
};

//should use loops but dont care
export const buildScrapeMessageListItem = async (scrapeMessage) => {
  const scrapeMessageListItem = document.createElement("li");
  scrapeMessageListItem.id = "admin-scrape-message-list-item";

  const scrapeMessageLabel = document.createElement("label");
  scrapeMessageLabel.id = "admin-scrape-message-label";
  scrapeMessageLabel.className = "status-label";
  scrapeMessageLabel.setAttribute("for", "admin-scrape-message-element");
  scrapeMessageLabel.textContent = "Scrape Message";

  const scrapeMessageElement = document.createElement("h2");
  scrapeMessageElement.id = "admin-scrape-message-element";
  scrapeMessageElement.className = "status-value";
  scrapeMessageElement.textContent = scrapeMessage || "NONE";

  scrapeMessageListItem.append(scrapeMessageLabel, scrapeMessageElement);

  return scrapeMessageListItem;
};

export const buildScrapeIdListItem = async (scrapeId) => {
  if (!scrapeId) return null;

  const scrapeIdListItem = document.createElement("li");
  scrapeIdListItem.id = "admin-scrape-id-list-item";

  const scrapeIdLabel = document.createElement("label");
  scrapeIdLabel.id = "admin-scrape-id-label";
  scrapeIdLabel.className = "status-label";
  scrapeIdLabel.setAttribute("for", "admin-scrape-id-element");
  scrapeIdLabel.textContent = "Scrape ID";

  const scrapeIdElement = document.createElement("h2");
  scrapeIdElement.id = "admin-scrape-id-element";
  scrapeIdElement.className = "status-value";
  scrapeIdElement.textContent = scrapeId || "NONE";

  scrapeIdListItem.append(scrapeIdLabel, scrapeIdElement);

  return scrapeIdListItem;
};

export const buildScrapeStatusListItem = async (scrapeActive) => {
  const scrapeStatusListItem = document.createElement("li");
  scrapeStatusListItem.id = "admin-scrape-status-list-item";

  const scrapeStatusLabel = document.createElement("label");
  scrapeStatusLabel.id = "admin-scrape-status-label";
  scrapeStatusLabel.className = "status-label";
  scrapeStatusLabel.setAttribute("for", "admin-scrape-status-element");
  scrapeStatusLabel.textContent = "Scrape Status";

  const scrapeStatusElement = document.createElement("h2");
  scrapeStatusElement.id = "admin-scrape-status-element";
  scrapeStatusElement.className = "status-value";
  scrapeStatusElement.textContent = scrapeActive ? "Active" : "Inactive";

  scrapeStatusListItem.append(scrapeStatusLabel, scrapeStatusElement);

  return scrapeStatusListItem;
};

export const buildSchedulerStatusListItem = async (schedulerActive) => {
  const schedulerStatusListItem = document.createElement("li");
  schedulerStatusListItem.id = "admin-scheduler-status-list-item";

  const schedulerStatusLabel = document.createElement("label");
  schedulerStatusLabel.id = "admin-scheduler-status-label";
  schedulerStatusLabel.className = "status-label";
  schedulerStatusLabel.setAttribute("for", "admin-scheduler-status-element");
  schedulerStatusLabel.textContent = "Scheduler Status";

  const schedulerStatusElement = document.createElement("h2");
  schedulerStatusElement.id = "admin-scheduler-status-element";
  schedulerStatusElement.className = "status-value";
  schedulerStatusElement.textContent = schedulerActive ? "Active" : "Inactive";

  schedulerStatusListItem.append(schedulerStatusLabel, schedulerStatusElement);

  return schedulerStatusListItem;
};

export const buildScrapeLengthSecondsListItem = async (scrapeLengthSeconds) => {
  if (!scrapeLengthSeconds) return null;

  const scrapeLengthSecondsListItem = document.createElement("li");
  scrapeLengthSecondsListItem.id = "admin-scrape-length-seconds-list-item";

  const scrapeLengthSecondsLabel = document.createElement("label");
  scrapeLengthSecondsLabel.id = "admin-scrape-length-seconds-label";
  scrapeLengthSecondsLabel.className = "status-label";
  scrapeLengthSecondsLabel.setAttribute("for", "admin-scrape-length-seconds-element");
  scrapeLengthSecondsLabel.textContent = "Scrape Length Seconds";

  const scrapeLengthSecondsElement = document.createElement("h2");
  scrapeLengthSecondsElement.id = "admin-scrape-length-seconds-element";
  scrapeLengthSecondsElement.className = "status-value";
  scrapeLengthSecondsElement.textContent = scrapeLengthSeconds || "NONE";

  scrapeLengthSecondsListItem.append(scrapeLengthSecondsLabel, scrapeLengthSecondsElement);

  return scrapeLengthSecondsListItem;
};
