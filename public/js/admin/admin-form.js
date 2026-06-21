export const buildAdminForm = () => {
  const form = document.createElement("div");
  form.className = "admin-sidebar-form";

  const commandGroup = buildCommandFormGroup();
  const targetGroup = buildTargetFormGroup();
  const howMuchGroup = buildHowMuchFormGroup();
  const urlGroup = buildUrlFormGroup();
  const buttonRow = buildButtonRow();

  form.append(commandGroup, targetGroup, howMuchGroup, urlGroup, buttonRow);
  return form;
};

//---

const buildCommandFormGroup = () => {
  const options = [
    { value: "admin-start-scrape", text: "Scrape Start", selected: true },
    { value: "admin-stop-scrape", text: "Scrape Stop" },
    { value: "admin-start-scheduler", text: "Scheduler ON" },
    { value: "admin-stop-scheduler", text: "Scheduler OFF" },
    { value: "admin-scrape-status", text: "Get Scrape Status" },
  ];
  return buildFormGroup("Command", "admin-command-type", buildSelect("admin-command-type", options));
};

const buildTargetFormGroup = () => {
  const options = [
    { value: "kcna", text: "KCNA", selected: true },
    { value: "watch", text: "KCNA Watch" },
  ];
  return buildFormGroup("Target", "admin-target-type", buildSelect("admin-target-type", options));
};

const buildHowMuchFormGroup = () => {
  const options = [
    { value: "admin-scrape-new", text: "Scrape NEW", selected: true },
    { value: "admin-scrape-all", text: "Scrape ALL" },
    { value: "admin-scrape-url", text: "Scrape URL" },
  ];
  return buildFormGroup("How Much", "admin-how-much", buildSelect("admin-how-much", options));
};

const buildUrlFormGroup = () => {
  const group = document.createElement("div");
  group.id = "admin-url-input-list-item";
  group.className = "admin-form-group hidden";

  const label = document.createElement("label");
  label.setAttribute("for", "admin-url-input");
  label.textContent = "URL";

  const input = document.createElement("input");
  input.type = "text";
  input.id = "admin-url-input";
  input.name = "admin-url-input";
  input.placeholder = "https://kcna.kp/...";

  group.append(label, input);
  return group;
};

const buildButtonRow = () => {
  const row = document.createElement("div");
  row.className = "admin-btn-row";

  const updateBtn = document.createElement("button");
  updateBtn.id = "admin-update-data-button";
  updateBtn.className = "admin-btn admin-btn-secondary";
  updateBtn.textContent = "Update Mongo";
  updateBtn.setAttribute("data-label", "admin-update-data-button");

  const submitBtn = document.createElement("button");
  submitBtn.id = "admin-submit-button";
  submitBtn.className = "admin-btn admin-btn-primary";
  submitBtn.textContent = "Submit";
  submitBtn.setAttribute("data-label", "admin-command-submit");

  row.append(updateBtn, submitBtn);
  return row;
};

//---

const buildFormGroup = (labelText, inputId, inputElement) => {
  const group = document.createElement("div");
  group.className = "admin-form-group";

  const label = document.createElement("label");
  label.setAttribute("for", inputId);
  label.textContent = labelText;

  group.append(label, inputElement);
  return group;
};

const buildSelect = (id, options) => {
  const select = document.createElement("select");
  select.name = id;
  select.id = id;

  for (const opt of options) {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.text;
    if (opt.selected) option.selected = true;
    select.append(option);
  }

  return select;
};
