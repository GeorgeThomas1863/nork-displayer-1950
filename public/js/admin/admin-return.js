import { buildEmptyDisplay } from "../control/return-form.js";
import { buildCollapseContainer } from "../util/collapse-display.js";

export const buildAdminStatusDisplay = async (inputData) => {
  if (!inputData) return null;

  console.log("!!!!!!!!!ADMIN STATUS DATA");
  console.dir(inputData);

  const adminStatusContainer = document.createElement("div");
  adminStatusContainer.id = "admin-status-container";

  const adminStatusTitle = document.createElement("h1");
  adminStatusTitle.className = "admin-status-title";
  adminStatusTitle.textContent = "KCNA Scrape Status";

  adminStatusContainer.appendChild(adminStatusTitle);

  return null;
};

//-------------------------

//input is array of all collections as objs
export const buildAdminReturnDisplay = async (inputData) => {
  console.log("BACKEND DATA OBJ");
  console.dir(inputData);

  const adminReturnContainer = document.createElement("div");
  adminReturnContainer.id = "admin-return-container";

  //empty display
  if (!inputData || !inputData.length) {
    const emptyData = await buildEmptyDisplay();
    adminReturnContainer.append(emptyData);
    return adminReturnContainer;
  }

  //from mr claude
  const statsSection = await buildAdminStatsSection(inputData);
  if (statsSection) adminReturnContainer.append(statsSection);

  for (let i = 0; i < inputData.length; i++) {
    const inputObj = inputData[i];
    const { collection, data } = inputObj;
    if (collection !== "log") continue;
    if (!data || !data.length) continue;

    //data is array of objs
    const adminTableContainer = await buildAdminTableContainer(data);
    if (adminTableContainer) adminReturnContainer.append(adminTableContainer);
  }

  return adminReturnContainer;
};

//--------------------------------

//would take longer to fix this than its worth
export const buildAdminStatsSection = async (inputData) => {
  if (!inputData || !inputData.length) return null;

  //!!!!!!!!!!!!!!!!!!

  //BUILD STATS ON BACKEND WITH MONGO QUERIES FOR WHAT YOU NEED, DISPLAY WITH MAP

  //ALSO WORK ON DIPSLAYING RETURN FROM COMMAND

  //ADD BACK IN CLICK LISTENER LOGIC FOR TABLE

  //!!!!!!!!!!!!!!!!!!!!

  // for (let i = 0; i < inputData.length; i++) {
  //   const inputObj = inputData[i];
  //   const { collection, data } = inputObj;

  //   if (!data || !data.length) continue;
  // }

  // console.log("inputData");
  // console.dir(inputData);

  const logData = inputData.find((item) => item.collection === "log")?.data || [];
  const articlesData = inputData.find((item) => item.collection === "articles")?.data || [];
  const picsData = inputData.find((item) => item.collection === "pics")?.data || [];
  const picSetsData = inputData.find((item) => item.collection === "picSets")?.data || [];
  const vidsData = inputData.find((item) => item.collection === "vids")?.data || [];

  const totalScrapes = logData.length;
  const activeScrapes = logData.filter((item) => item.scrapeActive).length;
  const finishedScrapes = logData.filter((item) => item.scrapeEndTime && !item.scrapeError).length;
  const errorScrapes = logData.filter((item) => item.scrapeError).length;
  const totalArticles = articlesData.length;
  const totalPics = picsData.length;
  const totalPicSets = picSetsData.length;
  const totalVids = vidsData.length;

  const completedScrapes = logData.filter((item) => item.scrapeLengthSeconds !== null);
  const avgDuration =
    completedScrapes.length > 0 ? Math.round(completedScrapes.reduce((sum, item) => sum + item.scrapeLengthSeconds, 0) / completedScrapes.length) : 0;

  const statsContainer = document.createElement("div");
  statsContainer.className = "admin-stats-container";

  const statsBar = document.createElement("div");
  statsBar.className = "admin-stats-bar";

  const stats = [
    { label: "Total", value: totalScrapes },
    { label: "Active", value: activeScrapes },
    { label: "Completed", value: finishedScrapes },
    { label: "Errors", value: errorScrapes },
    { label: "Avg Time", value: `${avgDuration}s` },
    { label: "Articles", value: totalArticles },
    { label: "Pics", value: totalPics },
    { label: "Pic Sets", value: totalPicSets },
    { label: "Videos", value: totalVids },
  ];

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];

    const statItem = document.createElement("div");
    statItem.className = "admin-stat-item";

    const statLabel = document.createElement("div");
    statLabel.className = "stat-label";
    statLabel.textContent = stat.label;

    const statValue = document.createElement("div");
    statValue.className = "stat-value";
    statValue.textContent = stat.value;

    statItem.append(statLabel, statValue);

    statsBar.appendChild(statItem);
  }

  statsContainer.appendChild(statsBar);
  return statsContainer;
};

//----------------------

export const buildAdminTableContainer = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const adminTableContainer = document.createElement("div");
  adminTableContainer.className = "admin-table-container";

  // Build table wrapper
  const adminTableWrapper = document.createElement("div");
  adminTableWrapper.className = "admin-table-wrapper";

  // Build header
  const adminTableHeaderWrapper = document.createElement("div");
  adminTableHeaderWrapper.className = "admin-table-header-wrapper";

  const adminTableTitle = document.createElement("h1");
  adminTableTitle.className = "admin-table-title";
  adminTableTitle.textContent = "KCNA Scrape Monitor";

  const adminRecordCount = document.createElement("div");
  adminRecordCount.className = "admin-record-count";
  adminRecordCount.textContent = `${inputArray.length} Records`;

  adminTableHeaderWrapper.appendChild(adminTableTitle);
  adminTableHeaderWrapper.appendChild(adminRecordCount);

  const adminTable = await buildAdminTable(inputArray);
  adminTableWrapper.appendChild(adminTable);

  adminTableContainer.appendChild(adminTableHeaderWrapper);
  adminTableContainer.appendChild(adminTableWrapper);

  const collapseTableParams = {
    titleElement: adminTableHeaderWrapper,
    contentElement: adminTableWrapper,
    isExpanded: true,
    className: "admin-table-collapse",
    dataAttribute: "admin-table-collapse",
  };

  const adminTableCollapseContainer = await buildCollapseContainer(collapseTableParams);
  adminTableContainer.appendChild(adminTableCollapseContainer);

  return adminTableContainer;
};

export const buildAdminTable = async (inputArray) => {
  const adminTable = document.createElement("table");
  adminTable.className = "admin-table";

  const thead = await buildAdminTableHeader();
  const tbody = document.createElement("tbody");

  for (let i = 0; i < inputArray.length; i++) {
    const row = await buildAdminTableRow(inputArray[i]);
    if (!row) continue;
    tbody.appendChild(row);
  }

  adminTable.appendChild(thead);
  adminTable.appendChild(tbody);

  return adminTable;
};

export const buildAdminTableHeader = async () => {
  const adminTableHeader = document.createElement("thead");
  adminTableHeader.className = "admin-table-header";

  const adminHeaderRow = document.createElement("tr");
  adminHeaderRow.className = "admin-header-row";

  const adminTableColumns = [
    { column: "id", text: "ID" },
    { column: "status", text: "Status" },
    { column: "startTime", text: "Start Time" },
    { column: "endTime", text: "End Time" },
    { column: "duration", text: "Duration" },
    { column: "step", text: "Step" },
    { column: "message", text: "Message" },
    { column: "active", text: "Active" },
  ];

  for (let i = 0; i < adminTableColumns.length; i++) {
    const col = adminTableColumns[i];
    const th = document.createElement("th");
    th.setAttribute("data-column", col.column);
    th.textContent = col.text + " ";

    const sortIcon = document.createElement("span");
    sortIcon.className = "sort-icon";
    sortIcon.textContent = "▼";

    th.appendChild(sortIcon);
    adminHeaderRow.appendChild(th);
  }

  adminTableHeader.appendChild(adminHeaderRow);
  return adminTableHeader;
};

export const buildAdminTableRow = async (inputObj) => {
  if (!inputObj) return null;

  const adminTableRow = document.createElement("tr");

  // ID cell
  const idCell = document.createElement("td");
  idCell.className = "id-cell";
  // idCell.textContent = await truncateMongoId(inputObj._id);
  idCell.textContent = inputObj._id;
  adminTableRow.appendChild(idCell);

  // Status cell
  const statusCell = document.createElement("td");
  const statusBadge = document.createElement("span");
  const statusClass = await getStatusClass(inputObj);
  const statusText = await getStatusText(inputObj);
  if (!statusClass || !statusText) return null;

  statusBadge.className = `status-badge ${statusClass}`;
  statusBadge.textContent = statusText;
  statusCell.appendChild(statusBadge);
  adminTableRow.appendChild(statusCell);

  // Start Time cell
  const startTimeCell = document.createElement("td");
  const startTimeText = await formatDateTime(inputObj.scrapeStartTime);
  startTimeCell.className = "timestamp";
  startTimeCell.textContent = startTimeText;
  adminTableRow.appendChild(startTimeCell);

  // End Time cell
  const endTimeCell = document.createElement("td");
  const endTimeText = await formatDateTime(inputObj.scrapeEndTime);
  endTimeCell.className = endTimeText === "—" ? "null-value" : "timestamp";
  endTimeCell.textContent = endTimeText;
  adminTableRow.appendChild(endTimeCell);

  // Duration cell
  const durationCell = document.createElement("td");
  const durationText = await formatDuration(inputObj.scrapeLengthSeconds);
  durationCell.className = durationText === null ? "null-value" : "duration";
  durationCell.textContent = durationText || "—";
  adminTableRow.appendChild(durationCell);

  // Step cell
  const stepCell = document.createElement("td");
  stepCell.textContent = inputObj.scrapeStep || "—";
  adminTableRow.appendChild(stepCell);

  // Message cell
  const messageCell = document.createElement("td");
  messageCell.className = "message-cell";
  messageCell.textContent = inputObj.scrapeMessage || "—";
  adminTableRow.appendChild(messageCell);

  // Active cell
  const activeCell = document.createElement("td");
  const boolIndicator = document.createElement("span");
  boolIndicator.className = `boolean-indicator ${inputObj.scrapeActive ? "boolean-true" : "boolean-false"}`;
  activeCell.appendChild(boolIndicator);

  const boolTextElement = document.createElement("span");
  boolTextElement.textContent = inputObj.scrapeActive ? "Yes" : "No";
  activeCell.appendChild(boolTextElement);
  adminTableRow.appendChild(activeCell);

  return adminTableRow;
};

// export const truncateMongoId = async (mongoId) => {
//   if (!mongoId) return "—";
//   const idStr = typeof mongoId === "object" ? mongoId.$oid || mongoId.toString() : mongoId.toString();
//   if (!idStr) return "—";
//   return "..." + idStr.slice(-6);
// };

export const getStatusClass = async (inputObj) => {
  if (!inputObj) return null;
  const { scrapeError, scrapeActive, scrapeEndTime } = inputObj;

  if (scrapeError) return "status-error";
  if (scrapeActive) return "status-active";
  if (scrapeEndTime) return "status-finished";
  return "status-inactive";
};

export const getStatusText = async (inputObj) => {
  if (!inputObj) return null;
  const { scrapeError, scrapeActive, scrapeEndTime } = inputObj;

  if (scrapeError) return "Error";
  if (scrapeActive) return "Active";
  if (scrapeEndTime) return "Finished";
  return "Inactive";
};

export const formatDateTime = async (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const formatDuration = async (durationSeconds) => {
  if (durationSeconds === null || durationSeconds === undefined) return null;
  return `${durationSeconds}s`;
};
