export const buildPicArrayElement = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = document.createElement("ul");
  picArrayElement.className = "pic-array-element";

  for (let i = 0; i < inputArray.length; i++) {
    const picListItem = await buildPicListItem(inputArray[i]);
    if (!picListItem) continue;
    // console.log("PIC LIST ITEM!!!", picListItem);

    picArrayElement.append(picListItem);
  }

  return picArrayElement;
};

export const buildPicListItem = async (inputObj) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const picListItem = document.createElement("li");
  picListItem.className = "pic-list-item";

  //ADD pic stats here (scrape date, server, size, etc)

  const picElement = await buildPicElement(savePath);
  picListItem.append(picElement);

  return picListItem;
};

export const buildPicElement = async (savePath) => {
  const picElement = document.createElement("img");
  picElement.className = "pic-element";

  //define pic path
  const fileName = savePath.split("/").pop();
  const picPath = "/kcna-pics/" + fileName;

  picElement.src = picPath;
  picElement.alt = "KCNA PIC";

  return picElement;
};
