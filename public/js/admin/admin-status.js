export const buildAdminStatusDisplay = async (inputData) => {
  const sidebar = document.getElementById("admin-sidebar");
  if (!sidebar) return null;

  const existingSection = document.getElementById("admin-status-section");
  if (existingSection) existingSection.remove();

  const { scrapeActive = false, schedulerActive = false, scrapeLengthSeconds = null, scrapeMessage = null, scrapeId = null } = inputData || {};

  const section = buildStatusSection({ scrapeActive, schedulerActive, scrapeLengthSeconds, scrapeMessage, scrapeId });
  sidebar.append(section);
  return true;
};

//---

const buildStatusSection = ({ scrapeActive, schedulerActive, scrapeLengthSeconds, scrapeMessage, scrapeId }) => {
  const section = document.createElement("div");
  section.id = "admin-status-section";

  const separator = buildSeparator();
  const heading = buildStatusHeading(scrapeActive);
  const rows = buildAllStatusRows({ scrapeActive, schedulerActive, scrapeLengthSeconds, scrapeMessage, scrapeId });

  section.append(separator, heading, ...rows);
  return section;
};

const buildSeparator = () => {
  const el = document.createElement("div");
  el.className = "admin-separator";
  return el;
};

const buildStatusHeading = (scrapeActive) => {
  const heading = document.createElement("div");
  heading.id = "admin-status-heading";
  heading.className = scrapeActive ? "admin-status-heading active" : "admin-status-heading";

  const dot = document.createElement("span");
  dot.className = "admin-status-dot";

  heading.append(dot, "Live Scrape Status");
  return heading;
};

const buildAllStatusRows = ({ scrapeActive, schedulerActive, scrapeLengthSeconds, scrapeMessage, scrapeId }) => {
  const rowDefs = [
    { label: "Scrape Message", id: "admin-scrape-message-element", value: scrapeMessage, mono: false },
    { label: "Scrape ID", id: "admin-scrape-id-element", value: scrapeId, mono: true },
    { label: "Scrape Status", id: "admin-scrape-status-element", value: scrapeActive ? "Active" : null, mono: false },
    { label: "Scheduler Status", id: "admin-scheduler-status-element", value: schedulerActive ? "Active" : null, mono: false },
    { label: "Scrape Seconds", id: "admin-scrape-length-seconds-element", value: scrapeLengthSeconds, mono: false },
  ];

  const rows = [];
  for (const def of rowDefs) {
    rows.push(buildStatusRow(def.label, def.id, def.value, def.mono));
  }
  return rows;
};

//---

const buildStatusRow = (labelText, valueId, value, isMono) => {
  const row = document.createElement("div");
  row.className = "admin-status-row";

  const labelEl = document.createElement("span");
  labelEl.className = "s-label";
  labelEl.textContent = labelText;

  const valueEl = document.createElement("span");
  valueEl.id = valueId;
  valueEl.className = buildValueClass(value, isMono);
  valueEl.textContent = value != null ? String(value) : "—";

  row.append(labelEl, valueEl);
  return row;
};

const buildValueClass = (value, isMono) => {
  let className = "s-value";
  if (isMono) className += " mono";
  if (value == null) className += " muted";
  return className;
};
