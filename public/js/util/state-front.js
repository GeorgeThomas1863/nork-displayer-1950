const stateFront = {
  isFirstLoad: true,
  scrapeId: null,
  eventTrigger: null,

  typeTrigger: "articles", //default articles
  articleType: "fatboy", //default fatboy
  picType: "all",
  vidType: "vidPages",
  howMany: null,
  orderBy: "newest-to-oldest",
  dataObj: {
    articles: {
      fatboy: null,
      topNews: null,
      latestNews: null,
      externalNews: null,
      anecdote: null,
      people: null,
      all: null,
    },
    pics: null,
    vids: null,
  },
};

export const updateStateFront = async (inputArray) => {
  const { typeTrigger, articleType } = stateFront;
  stateFront.isFirstLoad = false;

  //Handle article type counts
  if (typeTrigger === "articles") {
    for (const key in stateFront.dataObj.articles) {
      if (key === articleType) {
        stateFront.dataObj.articles[key] = inputArray.length;
        continue;
      }
      //reset all others
      stateFront.dataObj.articles[key] = null;
    }
    return true;
  }

  stateFront.dataObj[typeTrigger] = inputArray.length;

  return true;
};

export const resetDataObj = async () => {
  stateFront.dataObj = {
    articles: {
      fatboy: null,
      topNews: null,
      latestNews: null,
      externalNews: null,
      anecdote: null,
      people: null,
      all: null,
    },
    pics: null,
    vids: null,
  };
  stateFront.howMany = null;
};

//returns true if dataObj is NOT empty, false if it is
export const dataObjExistsCheck = async () => {
  if (!stateFront || !stateFront.dataObj) return false;
  const { dataObj } = stateFront;

  if (dataObj.pics !== null || dataObj.vids !== null) return true;

  for (let key in dataObj.articles) {
    if (dataObj.articles[key] && dataObj.articles[key] > 0) {
      return true;
    }
  }

  return false;
};

export default stateFront;
