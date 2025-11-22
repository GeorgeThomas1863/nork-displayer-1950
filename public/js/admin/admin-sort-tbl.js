import { rebuildAdminTableBody } from "./admin-return.js";

let currentSortColumn = null;
let currentSortDirection = "asc";
let adminTableData = [];

// Store the data when building the table
export const setAdminTableData = (data) => {
  adminTableData = data;
  currentSortColumn = null;
  currentSortDirection = "asc";
};

export const runAdminSortColumn = async (column) => {
  console.log("SORTING COLUMN:", column);

  if (!adminTableData || !adminTableData.length) {
    console.log("No table data available");
    return;
  }

  // Toggle sort direction if clicking same column
  if (currentSortColumn === column) {
    currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  } else {
    currentSortColumn = column;
    currentSortDirection = "asc";
  }

  // Update sort icons
  updateSortIcons(column);

  // Sort the data
  const sortedData = sortTableData(adminTableData, column, currentSortDirection);

  // Rebuild table body with sorted data
  await rebuildAdminTableBody(sortedData);
};

const sortTableData = (data, column, direction) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    let aVal, bVal;

    switch (column) {
      case "id":
        aVal = a._id || "";
        bVal = b._id || "";
        break;
      case "status":
        aVal = getStatusValue(a);
        bVal = getStatusValue(b);
        break;
      case "startTime":
        aVal = a.scrapeStartTime ? new Date(a.scrapeStartTime).getTime() : 0;
        bVal = b.scrapeStartTime ? new Date(b.scrapeStartTime).getTime() : 0;
        break;
      case "endTime":
        aVal = a.scrapeEndTime ? new Date(a.scrapeEndTime).getTime() : 0;
        bVal = b.scrapeEndTime ? new Date(b.scrapeEndTime).getTime() : 0;
        break;
      case "duration":
        aVal = a.scrapeLengthSeconds || 0;
        bVal = b.scrapeLengthSeconds || 0;
        break;
      case "step":
        aVal = a.scrapeStep || "";
        bVal = b.scrapeStep || "";
        break;
      case "message":
        aVal = a.scrapeMessage || "";
        bVal = b.scrapeMessage || "";
        break;
      case "active":
        aVal = a.scrapeActive ? 1 : 0;
        bVal = b.scrapeActive ? 1 : 0;
        break;
      default:
        return 0;
    }

    // Compare values
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return sortedData;
};

const getStatusValue = (obj) => {
  // Assign numeric values for status priority
  if (obj.scrapeError) return 4;
  if (obj.scrapeActive) return 3;
  if (obj.scrapeEndTime) return 2;
  return 1;
};

const updateSortIcons = (activeColumn) => {
  // Reset all sort icons
  const allHeaders = document.querySelectorAll(".admin-table-header th");
  allHeaders.forEach((header) => {
    const icon = header.querySelector(".sort-icon");
    if (icon) {
      icon.textContent = "▼";
      icon.style.opacity = "0.3";
    }
  });

  // Update active header icon
  const activeHeader = document.querySelector(`.admin-table-header th[data-column="${activeColumn}"]`);
  if (activeHeader) {
    const activeIcon = activeHeader.querySelector(".sort-icon");
    if (activeIcon) {
      activeIcon.textContent = currentSortDirection === "asc" ? "▲" : "▼";
      activeIcon.style.opacity = "1";
    }
  }
};

