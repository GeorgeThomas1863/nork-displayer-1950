import { buildCollapseContainer } from "../collapse.js";
import { buildPicListItem } from "./pic-return.js";

//for article pic array / pic set pic array
export const picDropDownContainer = async (inputArray, type) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = await buildPicList(inputArray, false);
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

export const buildPicList = async (inputArray, fullStats = true) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = document.createElement("ul");
  picArrayElement.id = "pic-list-element";

  for (let i = 0; i < inputArray.length; i++) {
    const picListItem = await buildPicListItem(inputArray[i], fullStats);
    if (!picListItem) continue;

    picArrayElement.append(picListItem);
  }

  return picArrayElement;
};
