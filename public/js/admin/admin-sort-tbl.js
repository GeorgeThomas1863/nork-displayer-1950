import { updateAdminDisplay } from "../admin.js";

let sortColumn = "endTime";
let sortDir = "desc";

export const runAdminSortColumn = async (column) => {
  if (!column) return null;

  if (column === sortColumn) {
    sortDir = sortDir === "asc" ? "desc" : "asc";
  } else {
    sortColumn = column;
    sortDir = "asc";
  }

  await updateAdminDisplay();
  return true;
};

export const getAdminSortState = () => {
  return { sortColumn, sortDir };
};

export const applySortIcons = (tableElement) => {
  if (!tableElement) return null;

  const allHeaders = tableElement.querySelectorAll("th[data-column]");
  for (let i = 0; i < allHeaders.length; i++) {
    const icon = allHeaders[i].querySelector(".sort-icon");
    if (!icon) continue;
    icon.textContent = "▼";
    icon.style.opacity = "0.3";
  }

  const activeHeader = tableElement.querySelector(`th[data-column="${sortColumn}"]`);
  const activeIcon = activeHeader ? activeHeader.querySelector(".sort-icon") : null;
  if (!activeIcon) return null;

  activeIcon.textContent = sortDir === "asc" ? "▲" : "▼";
  activeIcon.style.opacity = "1";

  return true;
};
