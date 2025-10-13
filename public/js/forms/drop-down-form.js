export const buildDropDownForm = async () => {
  // Create main drop-down container
  const dropDownElement = document.createElement("div");
  dropDownElement.id = "drop-down";
  dropDownElement.setAttribute("data-label", "dropdown");

  // Create bars link element
  const dropDownBars = document.createElement("a");
  dropDownBars.id = "drop-down-bars";
  dropDownBars.setAttribute("data-label", "dropdown");

  // Create three spans for the bars
  for (let i = 0; i < 3; i++) {
    const span = document.createElement("span");
    span.setAttribute("data-label", "dropdown");
    dropDownBars.appendChild(span);
  }

  // Assemble the dropdown
  dropDownElement.appendChild(dropDownBars);

  //build action buttons
  const dropDownButtonWrapper = await buildDropDownButtons();
  dropDownElement.appendChild(dropDownButtonWrapper);

  return dropDownElement;
};

export const buildDropDownButtons = async () => {
  const dropDownButtonWrapper = document.createElement("ul");
  dropDownButtonWrapper.id = "drop-down-button-wrapper";

  //hidden by default
  dropDownButtonWrapper.classList.add("hidden");

  const dropDownButtonArray = [
    //hidden by default
    { id: "admin-drop-down-button", text: "Admin", class: "drop-down-button" },
    { id: "scrape-kcna-drop-down-button", text: "Scrape KCNA", class: "drop-down-button" },
    { id: "track-crypto-drop-down-button", text: "Track Crypto", class: "drop-down-button" },
  ];

  //define admin link
  const adminLink = document.createElement("a");
  adminLink.href = "/admin";

  for (let i = 0; i < dropDownButtonArray.length; i++) {
    const li = document.createElement("li");
    const button = document.createElement("button");

    button.id = dropDownButtonArray[i].id;
    button.textContent = dropDownButtonArray[i].text;
    button.className = dropDownButtonArray[i].class;

    //add admin link
    if (dropDownButtonArray[i].id === "admin-drop-down-button") {
      adminLink.appendChild(button);
      li.appendChild(adminLink);
    }

    li.appendChild(button);
    dropDownButtonWrapper.appendChild(li);
  }

  return dropDownButtonWrapper;
};
