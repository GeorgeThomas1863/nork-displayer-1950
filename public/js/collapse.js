export const buildCollapseContainer = async (inputObj) => {
  if (!inputObj) return null;
  const { titleElement, contentElement, isExpanded = false, className = "" } = inputObj;

  // Create container
  const container = document.createElement("div");
  container.className = `collapse-container ${className}`;

  // Create header with arrow and title
  const collapseHeader = document.createElement("div");
  collapseHeader.className = "collapse-header";

  const arrow = document.createElement("div");
  arrow.className = isExpanded ? "collapse-arrow expanded" : "collapse-arrow";

  titleElement.className = "collapse-title";

  // const titleElement = document.createElement("div");
  // titleElement.className = "collapse-title";
  // titleElement.textContent = title;

  // Add arrow and title to header
  collapseHeader.append(arrow, titleElement);

  contentElement.className = isExpanded ? "collapse-content" : "collapse-content hidden";

  // Add event listener for toggling
  collapseHeader.addEventListener("click", () => {
    arrow.classList.toggle("expanded");
    contentElement.classList.toggle("hidden");
  });

  // Assemble the component
  container.append(collapseHeader, contentElement);

  return container;
};

export const defineCollapseItems = (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  for (let i = 0; i < inputArray.length; i++) {
    const collapseElement = inputArray[i];
    const header = collapseElement.querySelector(".collapse-header");

    header.addEventListener("click", () => {
      // collapse shit
      for (let j = 0; j < inputArray.length; j++) {
        if (i !== j) {
          const otherCollapse = inputArray[j];
          const otherContent = otherCollapse.querySelector(".collapse-content");
          const otherArrow = otherCollapse.querySelector(".collapse-arrow");

          otherContent.classList.add("hidden");
          otherArrow.classList.remove("expanded");
        }
      }
    });
  }
};
