import { buildPicList } from "./pic-return-alone.js";
import { buildCollapseContainer } from "../collapse.js";

//for article pic array / pic set pic array
export const picDropDownContainer = async (inputArray, type) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElementRaw = await buildPicList(inputArray);
  if (!picArrayElementRaw) return null;

  const picArrayElement = await removePicDataByType(picArrayElementRaw, type);

  // console.log("PIC DROP DOWN CONTAINER PIC ARRAY ELEMENT");
  // console.log(picArrayElement);

  //build pic title element
  const picTitleElement = document.createElement("div");
  picTitleElement.id = `${type}-pic-header`;
  picTitleElement.textContent = `${inputArray.length} ${type.toUpperCase()} PIC${inputArray.length > 1 ? "S" : ""}`;

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

//!!!!
//HERE
//!!!!!!

//FIGURE OUT BELOW LOOP
export const removePicDataByType = async (picArrayElement, type) => {
  if (!picArrayElement || !type) return null;

  const picListItemArray = picArrayElement.querySelectorAll("li");

  // if (type !== "article" && type !== "picSet") return null;

  for (let i = 0; i < picListItemArray.length; i++) {
    const picListItem = picListItemArray[i];
    const picSource = picListItem.querySelector("#pic-source");
    if (picSource) {
      picSource.remove();
    }
  }
};
