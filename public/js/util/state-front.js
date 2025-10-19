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
    },
    pics: null,
    vids: null,
  },
};

//BUILD
export const checkUpdateNeeded = async () => {
  const { howMany } = stateFront;

  const currentData = await getCurrentData();
  if (!currentData || !howMany) {
    const error = new Error("CANT GET CURRENT DATA");
    error.function = "checkUpdateNeeded";
    throw error;
  }

  if (currentData === howMany || currentData > howMany) return false;

  return true;
};

export const getCurrentData = async () => {
  const { typeTrigger, dataObj, articleType } = stateFront;

  if (typeTrigger === "articles") {
    return dataObj.articles[articleType];
  }

  return dataObj[typeTrigger];
};

export default stateFront;
