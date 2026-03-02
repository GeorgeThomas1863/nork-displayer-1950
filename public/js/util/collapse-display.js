export const hideArray = (inputs) => {
  for (const input of inputs) {
    if (!input) continue;
    input.classList.add("hidden");
  }
};

export const unhideArray = (inputs) => {
  for (const input of inputs) {
    if (!input) continue;
    input.classList.remove("hidden");
  }
};

export const buildCollapseContainer = async (inputObj) => {
  if (!inputObj || !inputObj.titleElement || !inputObj.contentElement) return null;
  const { titleElement, contentElement, isExpanded = false, className = "", dataAttribute = "" } = inputObj;

  // Create container
  const collapseContainer = document.createElement("div");
  collapseContainer.className = `collapse-container ${className}`;

  // Create header with arrow and title
  const collapseHeader = document.createElement("div");
  collapseHeader.setAttribute("data-update", dataAttribute);
  collapseHeader.className = "collapse-header";

  const arrow = document.createElement("div");
  arrow.className = isExpanded ? "collapse-arrow expanded" : "collapse-arrow";
  arrow.setAttribute("data-update", dataAttribute);

  // titleElement.className = "collapse-title";
  titleElement.classList.add("collapse-title");
  titleElement.setAttribute("data-update", dataAttribute);

  //add arrow / title to header
  collapseHeader.append(arrow, titleElement);

  //below preserves existing classes on content
  const existingClasses = contentElement.className || "";
  const collapseClasses = isExpanded ? "collapse-content" : "collapse-content hidden";
  contentElement.className = existingClasses ? `${existingClasses} ${collapseClasses}` : collapseClasses;

  //add collapse element at end
  collapseContainer.append(collapseHeader, contentElement);

  return collapseContainer;
};

export const defineCollapseItems = (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  for (let i = 0; i < inputArray.length; i++) {
    const collapseElement = inputArray[i];
    const header = collapseElement.querySelector(".collapse-header");
    const content = collapseElement.querySelector(".collapse-content");
    const arrow = collapseElement.querySelector(".collapse-arrow");
    if (!header || !content || !arrow) continue;

    header.addEventListener("click", () => {
      arrow.classList.toggle("expanded");
      content.classList.toggle("hidden");

      for (let j = 0; j < inputArray.length; j++) {
        if (i === j) continue;
        const otherContent = inputArray[j].querySelector(".collapse-content");
        const otherArrow = inputArray[j].querySelector(".collapse-arrow");
        if (otherContent) otherContent.classList.add("hidden");
        if (otherArrow) otherArrow.classList.remove("expanded");
      }
    });
  }
};
