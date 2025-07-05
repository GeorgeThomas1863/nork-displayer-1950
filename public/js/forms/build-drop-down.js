export const buildDropDown = async () => {
  // Create main drop-down container
  const dropDownElement = document.createElement("div");
  dropDownElement.id = "drop-down";
  dropDownElement.setAttribute("data-toggle", "dropdown");

  // Create bars link element
  const dropDownBars = document.createElement("a");
  dropDownBars.id = "drop-down-bars";
  dropDownBars.setAttribute("data-toggle", "dropdown");

  // Create three spans for the bars
  for (let i = 0; i < 3; i++) {
    const span = document.createElement("span");
    span.setAttribute("data-toggle", "dropdown");
    dropDownBars.appendChild(span);
  }

  // Assemble the dropdown
  dropDownElement.appendChild(dropDownBars);

  //build action buttons
  const actionButtonElement = await buildActionButtonElement();
  dropDownElement.appendChild(actionButtonElement);

  return dropDownElement;
};

export const buildActionButtonElement = async () => {
  const actionButtonElement = document.createElement("ul");
  actionButtonElement.id = "action-button-element";

  //hidden by default
  actionButtonElement.classList.add("hidden");

  const actionButtonArray = [
    //hidden by default
    { id: "scrape-kcna-action-button", text: "Scrape KCNA", class: "action-button" },
    { id: "track-crypto-action-button", text: "Track Crypto", class: "action-button" },
  ];

  for (let i = 0; i < actionButtonArray.length; i++) {
    const li = document.createElement("li");
    const button = document.createElement("button");

    button.id = actionButtonArray[i].id;
    button.textContent = actionButtonArray[i].text;
    button.className = actionButtonArray[i].class;

    li.appendChild(button);
    actionButtonElement.appendChild(li);
  }

  return actionButtonElement;
};
