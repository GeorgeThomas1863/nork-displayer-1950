import { buildCollapseContainer } from "../util/collapse-display.js";
import { buildPicWrapper } from "./pics-return.js";

export const buildPicsCollapseContainer = async (inputArray, type) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = await buildPicWrapper(inputArray);
  if (!picArrayElement) return null;

  //build pic title element
  const picTitleElement = document.createElement("div");
  picTitleElement.id = `${type}-pic-header`;
  picTitleElement.textContent = `${inputArray.length} ${type.toUpperCase()} PIC${inputArray.length > 1 ? "S" : ""}`;

  //EXTRACT PIC DATE?

  //build collapse container
  const picCollapseObj = {
    titleElement: picTitleElement,
    contentElement: picArrayElement,
    isExpanded: true,
    className: `${type}-pic-collapse`,
  };

  const picCollapseElement = await buildCollapseContainer(picCollapseObj);

  return picCollapseElement;
};
