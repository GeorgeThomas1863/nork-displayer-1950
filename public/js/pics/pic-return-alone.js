//PIC ALONE DISPLAY
export const buildPicAloneDisplay = async (inputArray) => {
  if (!inputArray || !inputArray.length) return null;

  const picList = document.createElement("ul");
  picList.id = "pic-array-element";

  for (let i = 0; i < inputArray.length; i++) {
    const picListItem = await buildPicListItem(inputArray[i]);
    if (!picListItem) continue;

    picList.appendChild(picListItem);
  }

  return picList;
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

export const buildPicListItem = async (inputObj, fullStats = true) => {
  if (!inputObj || !inputObj.savePath) return null;
  const { savePath } = inputObj;

  const picListItem = document.createElement("li");
  picListItem.id = "pic-list-item";

  //build pic / stat elements
  const picElement = await buildPicElement(savePath);
  const picStatsElement = await buildPicStatsElement(inputObj, fullStats);

  picListItem.append(picElement, picStatsElement);

  return picListItem;
};

//build pic itself
export const buildPicElement = async (savePath) => {
  if (!savePath) return null;

  const picElement = document.createElement("img");
  picElement.id = "pic-element";

  //define pic path
  const fileName = savePath.split("/").pop();
  const picPath = "/kcna-pics/" + fileName;

  picElement.src = picPath;
  picElement.alt = "KCNA PIC";

  return picElement;
};

//build pic stats
export const buildPicStatsElement = async (inputObj, fullStats = true) => {
  if (!inputObj) return null;
  const { picDate, picSource, headerData } = inputObj;

  const picStatsElement = document.createElement("div");
  picStatsElement.id = "pic-stats";

  //only include source on full stats
  if (fullStats) {
    const picDateElement = await buildPicDateElement(picDate);
    const picSourceElement = await buildPicSourceElement(picSource);
    picStatsElement.append(picDateElement, picSourceElement);
  }

  const picServerElement = await buildPicServerElement(headerData);
  picStatsElement.append(picServerElement);

  return picStatsElement;
};

//extract / format pic date
export const buildPicDateElement = async (picDate) => {
  if (!picDate) return null;

  const dateElement = document.createElement("div");
  dateElement.id = "pic-date";
  const dateObj = new Date(picDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  dateElement.innerHTML = `<b>Date:</b> ${formattedDate}`;

  return dateElement;
};

//calc where pic from (do on backend)
export const buildPicSourceElement = async (picSource) => {
  if (!picSource) return null;

  const picSourceElement = document.createElement("div");
  picSourceElement.id = "pic-source";
  picSourceElement.innerHTML = `<b>Pic From:</b> ${picSource}`;

  return picSourceElement;
};

//EXTRACT PIC SERVER DATA
export const buildPicServerElement = async (headerData) => {
  if (!headerData || !headerData.server) return null;
  const serverData = headerData.server;

  const picServerElement = document.createElement("div");
  picServerElement.id = "pic-server";
  picServerElement.innerHTML = `<b>Server Data:</b> ${serverData}`;

  return picServerElement;
};
