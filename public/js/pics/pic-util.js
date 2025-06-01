//rename to pic dropdown
export const picDropDownContainer = async (inputArray, type) => {
  if (!inputArray || !inputArray.length) return null;

  const picArrayElement = await buildPicList(inputArray);
  if (!picArrayElement) return null;

  const typeStr = type.toUpperCase();

  //build pic title element
  const picTitleElement = document.createElement("div");
  picTitleElement.id = `${typeStr}-pic-header`;
  picTitleElement.textContent = `${inputArray.length} ${typeStr} PIC${inputArray.length > 1 ? "S" : ""}`;

  //build collapse container
  const picCollapseObj = {
    titleElement: picTitleElement,
    contentElement: picArrayElement,
    isExpanded: true,
    className: `${typeStr}-pic-collapse`,
  };

  const picCollapseElement = await buildCollapseContainer(picCollapseObj);

  return picCollapseElement;
};
