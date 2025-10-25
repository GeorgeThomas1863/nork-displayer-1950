import { buildCollapseContainer } from "../util/collapse-display.js";

// MAIN FUNCTION - Build the complete stats display
export const buildAdminReturnDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const adminReturnContainer = document.createElement("div");
  adminReturnContainer.id = "admin-return-container";

  // Build the log history section
  const logHistorySection = await buildLogHistorySection(inputArray);
  if (logHistorySection) {
    adminReturnContainer.append(logHistorySection);
  }

  // Build the database statistics section
  const dbStatsSection = await buildDatabaseStatsSection(inputArray);
  if (dbStatsSection) {
    adminReturnContainer.append(dbStatsSection);
  }

  return adminReturnContainer;
};

// ==========================================
// LOG HISTORY SECTION
// ==========================================

//claude method
export const buildLogHistorySection = async (inputArray) => {
  // Find the log collection
  const logCollection = inputArray.find((item) => item.collection === "log");
  if (!logCollection || !logCollection.data || !logCollection.data.length) {
    return null;
  }

  const logData = logCollection.data;

  // Create the log list
  const logList = document.createElement("ul");
  logList.id = "log-history-list";
  logList.className = "stats-list";

  // Sort by scrapeStartTime (most recent first)
  const sortedLogs = [...logData].sort((a, b) => {
    return new Date(b.scrapeStartTime) - new Date(a.scrapeStartTime);
  });

  // Build each log entry
  let isFirst = true;
  const collapseArray = [];

  for (let i = 0; i < sortedLogs.length; i++) {
    const logEntry = sortedLogs[i];
    const logListItem = await buildLogListItem(logEntry, i + 1, isFirst);
    logList.append(logListItem);

    // Store collapse items for group behavior
    const collapseItem = logListItem.querySelector(".collapse-container");
    if (collapseItem) collapseArray.push(collapseItem);

    isFirst = false;
  }

  // Create title for collapse
  const titleElement = document.createElement("div");
  titleElement.textContent = "SCRAPE LOG HISTORY";

  // Wrap in collapse container
  const logCollapseObj = {
    titleElement: titleElement,
    contentElement: logList,
    isExpanded: true,
    className: "log-history-collapse",
  };

  const logCollapseContainer = await buildCollapseContainer(logCollapseObj);
  logCollapseContainer.className = "wrapper stats-section";
  logCollapseContainer.id = "log-history-section";

  return logCollapseContainer;
};

export const buildLogListItem = async (logEntry, sessionNumber, isFirst) => {
  const { scrapeStartTime } = logEntry;

  const logListItem = document.createElement("li");
  logListItem.className = "log-list-item";

  // Build the log details content
  const logDetailsContainer = await buildLogDetailsContainer(logEntry, sessionNumber);

  // Create title for this log entry
  const logTitle = await buildLogTitle(scrapeStartTime, sessionNumber);

  // Wrap in collapse
  const logItemCollapseObj = {
    titleElement: logTitle,
    contentElement: logDetailsContainer,
    isExpanded: isFirst,
    className: "log-item-collapse",
  };

  const logItemCollapse = await buildCollapseContainer(logItemCollapseObj);
  logListItem.append(logItemCollapse);

  return logListItem;
};

export const buildLogTitle = async (scrapeStartTime, sessionNumber) => {
  const titleElement = document.createElement("div");
  titleElement.className = "log-title";

  const date = new Date(scrapeStartTime);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  titleElement.innerHTML = `Scrape Session #${sessionNumber} <span class="log-title-date">${formattedDate} ${formattedTime}</span>`;

  return titleElement;
};

export const buildLogDetailsContainer = async (logEntry, sessionNumber) => {
  const { _id, scrapeStartTime } = logEntry;

  const detailsContainer = document.createElement("div");
  detailsContainer.className = "log-details-container";

  // Create a grid for the details
  const detailsGrid = document.createElement("div");
  detailsGrid.className = "log-details-grid";

  // Build detail rows
  const details = [
    { label: "Session ID", value: _id },
    { label: "Start Time", value: formatDateTime(scrapeStartTime) },
  ];

  for (const detail of details) {
    const detailRow = await buildDetailRow(detail.label, detail.value);
    detailsGrid.append(detailRow);
  }

  detailsContainer.append(detailsGrid);

  return detailsContainer;
};

export const buildDetailRow = async (label, value) => {
  const row = document.createElement("div");
  row.className = "detail-row";

  const labelEl = document.createElement("span");
  labelEl.className = "detail-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.className = "detail-value";
  valueEl.textContent = value || "N/A";

  row.append(labelEl, valueEl);

  return row;
};

// ==========================================
// DATABASE STATISTICS SECTION
// ==========================================

export const buildDatabaseStatsSection = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  // Calculate all the counts
  const stats = calculateStats(inputArray);

  // Create the stats content
  const statsContent = document.createElement("div");
  statsContent.className = "db-stats-content";

  // Build Collection Totals section
  const collectionTotalsSection = await buildCollectionTotalsSection(stats);
  statsContent.append(collectionTotalsSection);

  // Build Article Breakdown section
  const articleBreakdownSection = await buildArticleBreakdownSection(stats);
  if (articleBreakdownSection) {
    statsContent.append(articleBreakdownSection);
  }

  // Build Recent Activity section
  const recentActivitySection = await buildRecentActivitySection(stats, inputArray);
  if (recentActivitySection) {
    statsContent.append(recentActivitySection);
  }

  // Create title for collapse
  const titleElement = document.createElement("div");
  titleElement.textContent = "DATABASE STATISTICS";

  // Wrap in collapse container
  const statsCollapseObj = {
    titleElement: titleElement,
    contentElement: statsContent,
    isExpanded: true,
    className: "db-stats-collapse",
  };

  const statsCollapseContainer = await buildCollapseContainer(statsCollapseObj);
  statsCollapseContainer.className = "wrapper stats-section";
  statsCollapseContainer.id = "db-stats-section";

  return statsCollapseContainer;
};

export const buildCollectionTotalsSection = async (stats) => {
  const section = document.createElement("div");
  section.className = "stats-subsection";

  const sectionTitle = document.createElement("h3");
  sectionTitle.className = "stats-subsection-title";
  sectionTitle.textContent = "Collection Totals";
  section.append(sectionTitle);

  const statsList = document.createElement("ul");
  statsList.className = "stats-list-grid";

  const totals = [
    { label: "Total Scrape Sessions", value: stats.totalScrapeSessions },
    { label: "Total Articles", value: stats.totalArticles },
    { label: "Total Pictures", value: stats.totalPics },
    { label: "Total Picture Sets", value: stats.totalPicSets },
    { label: "Total Videos", value: stats.totalVids },
    { label: "Total Video Pages", value: stats.totalVidPages },
  ];

  for (const item of totals) {
    const statItem = await buildStatItem(item.label, item.value);
    statsList.append(statItem);
  }

  section.append(statsList);

  return section;
};

export const buildArticleBreakdownSection = async (stats) => {
  if (!stats.articlesByType || Object.keys(stats.articlesByType).length === 0) {
    return null;
  }

  const section = document.createElement("div");
  section.className = "stats-subsection";

  const sectionTitle = document.createElement("h3");
  sectionTitle.className = "stats-subsection-title";
  sectionTitle.textContent = "Article Breakdown";
  section.append(sectionTitle);

  const statsList = document.createElement("ul");
  statsList.className = "stats-list-grid";

  // Sort by count (descending)
  const sortedTypes = Object.entries(stats.articlesByType).sort((a, b) => b[1] - a[1]);

  for (const [type, count] of sortedTypes) {
    const label = formatArticleType(type);
    const statItem = await buildStatItem(label, count);
    statsList.append(statItem);
  }

  section.append(statsList);

  return section;
};

export const buildRecentActivitySection = async (stats, inputArray) => {
  const logCollection = inputArray.find((item) => item.collection === "log");
  if (!logCollection || !logCollection.data || !logCollection.data.length) {
    return null;
  }

  const section = document.createElement("div");
  section.className = "stats-subsection";

  const sectionTitle = document.createElement("h3");
  sectionTitle.className = "stats-subsection-title";
  sectionTitle.textContent = "Recent Activity";
  section.append(sectionTitle);

  const statsList = document.createElement("ul");
  statsList.className = "stats-list-grid";

  // Find most recent scrape
  const sortedLogs = [...logCollection.data].sort((a, b) => {
    return new Date(b.scrapeStartTime) - new Date(a.scrapeStartTime);
  });

  const mostRecentScrape = sortedLogs[0];
  const mostRecentDate = new Date(mostRecentScrape.scrapeStartTime);
  const formattedRecentDate = mostRecentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const recentStats = [
    { label: "Last Scrape Session", value: formattedRecentDate },
    { label: "Total Sessions", value: stats.totalScrapeSessions },
  ];

  for (const item of recentStats) {
    const statItem = await buildStatItem(item.label, item.value);
    statsList.append(statItem);
  }

  section.append(statsList);

  return section;
};

export const buildStatItem = async (label, value) => {
  const listItem = document.createElement("li");
  listItem.className = "stat-item";

  const labelEl = document.createElement("span");
  labelEl.className = "stat-label";
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.className = "stat-value";
  valueEl.textContent = typeof value === "number" ? value.toLocaleString() : value;

  listItem.append(labelEl, valueEl);

  return listItem;
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const calculateStats = async (inputArray) => {
  const stats = {
    totalScrapeSessions: 0,
    totalArticles: 0,
    totalPics: 0,
    totalPicSets: 0,
    totalVids: 0,
    totalVidPages: 0,
    articlesByType: {},
  };

  for (const collection of inputArray) {
    const { collection: collectionName, data } = collection;
    const count = data ? data.length : 0;

    switch (collectionName) {
      case "log":
        stats.totalScrapeSessions = count;
        break;
      case "articles":
        stats.totalArticles = count;
        // Count by article type
        if (data) {
          for (const article of data) {
            const type = article.articleType || "unknown";
            stats.articlesByType[type] = (stats.articlesByType[type] || 0) + 1;
          }
        }
        break;
      case "pics":
        stats.totalPics = count;
        break;
      case "picSets":
        stats.totalPicSets = count;
        break;
      case "vids":
        stats.totalVids = count;
        break;
      case "vidPages":
        stats.totalVidPages = count;
        break;
    }
  }

  return stats;
};

export const formatDateTime = async (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export const formatArticleType = async (type) => {
  // Convert camelCase or other formats to readable format
  const typeMap = {
    fatboy: '"Revolutionary Activities" [KJU]',
    topNews: "Top News",
    latestNews: "Latest News",
    externalNews: "External News",
    anecdote: "Revolutionary Anecdotes",
    people: "Always in Memory of the People",
    all: "All Articles",
  };

  return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
};
