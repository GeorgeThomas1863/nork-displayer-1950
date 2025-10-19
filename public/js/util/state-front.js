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
  // if (!inputObj) return null;

  // console.log("STATE FRONT");
  // console.log(stateFront);
};

export default stateFront;
