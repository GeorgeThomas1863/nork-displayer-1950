import { setCurrentVidState } from "./vid-data.js";

//VID ALONE DISPLAY
export const buildVidReturnDisplay = async (inputArray, stateParams = null) => {
  if (!inputArray || !inputArray.length) return null;

  const vidList = document.createElement("ul");
  vidList.id = "vid-array-element";
  vidList.className = "hidden";

  //set state params
  if (stateParams) {
    //state params from user input
    setCurrentVidState(vidList, stateParams);
  } else {
    //handle initial load
    const defaultStateParams = ["vid-alone", 3, "vid-newest-to-oldest"];
    setCurrentVidState(vidList, defaultStateParams);
  }

  for (let i = 0; i < inputArray.length; i++) {
    //SHOULD DETERMINE HERE IF VID PAGE OR VID ALONE
    const vidListItem = await buildVidListItem(inputArray[i]);
    if (!vidListItem) continue;

    vidList.appendChild(vidListItem);
  }

  return vidList;
};

export const buildVidListItem = async (inputObj) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const vidListItem = document.createElement("li");
  vidListItem.id = "vid-list-item";

  //ADD pic stats here (scrape date, server, size, etc)

  const vidElement = await buildVidElement(savePath);
  vidListItem.append(vidElement);

  return vidListItem;
};

export const buildVidElement = async (savePath) => {
  if (!savePath) return null;

  const vidElement = document.createElement("video");
  vidElement.id = "vid-element";
  vidElement.controls = true;

  const sourceElement = document.createElement("source");
  const fileName = savePath.split("/").pop();
  const vidPath = "/kcna-vids/" + fileName;

  sourceElement.src = vidPath;
  sourceElement.type = "video/mp4";

  vidElement.appendChild(sourceElement);

  return vidElement;
};
