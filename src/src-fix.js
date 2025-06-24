import fs from "fs";

//REMOVE INVALID ITEMS FROM RETURN
export const removeInvalidItems = async (inputArray, dataType, howMany) => {
  if (!inputArray || !inputArray.length || !dataType) return null;

  // console.log("REMOVE INVALID ITEMS DATA TYPE");
  // console.log(dataType);
  // console.log(inputArray);

  const dataReturnArray = [];
  switch (dataType) {
    //delete pics that dont exist from picArray
    case "articles":
    case "pics":
      for (let i = 0; i < inputArray.length; i++) {
        //extract picArray
        const dataObj = inputArray[i];
        const { picArray } = dataObj;
        if (!picArray) {
          dataReturnArray.push(dataObj);
          if (dataReturnArray.length === howMany) return dataReturnArray;
          continue;
        }

        //check if exists
        const picArrayFixed = [];
        for (let j = 0; j < picArray.length; j++) {
          try {
            const picObj = picArray[j];
            if (!picObj || !picObj.savePath) continue;
            const itemExists = await checkItemExists(picObj);
            if (!itemExists) continue;

            picArrayFixed.push(picObj);
          } catch (e) {
            console.log(e.message + "; SAVE PATH: " + e.savePath);
            continue;
          }
        }

        dataObj.picArray = picArrayFixed;
        dataReturnArray.push(dataObj);

        //check if right length return when it is
        if (dataReturnArray.length === howMany) return dataReturnArray;
      }
      break;

    case "vids":
      for (let i = 0; i < inputArray.length; i++) {
        try {
          const dataObj = inputArray[i];

          //check thumbnail first
          if (!dataObj || !dataObj.thumbnailData) continue;
          const { thumbnailData } = dataObj;
          const thumbnailExists = await checkItemExists(thumbnailData);
          if (!thumbnailExists) continue;

          //check vid exists
          if (!dataObj || !dataObj.vidData) continue;
          const { vidData } = dataObj;

          const itemExists = await checkItemExists(vidData, "vid");
          if (!itemExists) continue;

          dataReturnArray.push(dataObj);
          if (dataReturnArray.length === howMany) return dataReturnArray;
        } catch (e) {
          console.log(e.message + "; SAVE PATH: " + e.savePath);
          continue;
        }
      }
      break;
  }

  //half assed answer below, might need to redo
  const newDataArray = await rePullData(dataType, howMany);

  // console.log("NEW DATA ARRAY");
  // console.log(newDataArray);

  return newDataArray;
};

//re-write to use fs
export const checkItemExists = async (inputObj, type = "pic") => {
  const { savePath } = inputObj;
  if (!savePath) return null;

  // console.log("CHECK ITEM EXISTS");
  // console.log(inputObj);

  if (!fs.existsSync(savePath)) {
    const error = new Error("ITEM NOT DOWNLOADED");
    error.savePath = savePath;
    throw error;
  }

  let checkSizeRaw = 0;
  //adult would write this with ternary operator, change later
  switch (type) {
    case "pic":
      const { downloadedSize } = inputObj;
      checkSizeRaw = downloadedSize;
      break;

    case "vid":
      const { vidSizeBytes } = inputObj;
      checkSizeRaw = vidSizeBytes;
      break;
  }

  if (!checkSizeRaw) {
    console.log("AHHHHHHHHHHHHHHHHHHHH");
    const error = new Error("FILE CORRUPTED / WRONG SIZE");
    error.savePath = savePath;
    throw error;
  }

  //GET FILE SIZE FRM FILE (TEST THIS)
  const fileSize = fs.statSync(savePath).size;

  //check for slightly smaller file
  const checkSize = checkSizeRaw * 0.7;
  if (fileSize < checkSize) {
    console.log("AHHHHHHHHHHHHHHHHHHHH");
    const error = new Error("FILE CORRUPTED / WRONG SIZE");
    error.savePath = savePath;
    throw error;
  }

  //otherwise return true
  return true;
};

//[half assed answer below, might need to do same for picSets / assumes prob is newest shit not downloaded]
//RE-GET / PULL DATA
export const rePullData = async (dataType, howMany) => {
  const { vidsDownloaded, vidPageContent, vidPath } = CONFIG;

  // console.log("RE-PULL DATA DATA TYPE TRIGGERED");
  // console.log(dataType);
  // console.log(howMany);

  //REBUILD SO IT JUST GETS THE FUCKING FILE ON THE DRIVE
  switch (dataType) {
    case "vids":
      //get vid array on drive
      const vidArrayFS = fs.readdirSync(vidPath);

      const latestVid = await getLatestVid(vidArrayFS);

    //     const vidDataModel = new dbModel(vidParams, vidsDownloaded);
    //     const vidDataObj = await vidDataModel.getNewestItemsArray();
    //     if (!vidDataObj || !vidDataObj[0] || !vidDataObj[0].url) return null;
    //     const { url } = vidDataObj[0];

    //     console.log("Vid Data Obj");
    //     console.dir(vidDataObj);

    //     const vidPageFindParams = {
    //       keyToLookup: "vidURL",
    //       itemValue: url,
    //     };

    //     //use url to get vid Page
    //     const vidPageFindModel = new dbModel(vidPageFindParams, vidPageContent);
    //     const vidPageObj = await vidPageFindModel.getUniqueItem();
    //     if (!vidPageObj || !vidPageObj.vidPageId) return null;
    //     const { vidPageId } = vidPageObj;

    //     const vidPageGetParams = {
    //       sortKey: "date",
    //       sortKey2: "vidPageId",
    //       howMany: howMany,
    //       filterKey: "vidPageId",
    //       filterValue: { $lte: vidPageId },
    //     };

    //     const vidPageGetModel = new dbModel(vidPageGetParams, vidPageContent);
    //     const vidPageGetArray = await vidPageGetModel.getNewestItemsByTypeArray();

    //     return vidPageGetArray;

    //   default:
    //     return null;
  }
};

export const getLatestVid = async (inputArray) => {
  console.log("GET LATEST VID");
  console.log(inputArray);
};
