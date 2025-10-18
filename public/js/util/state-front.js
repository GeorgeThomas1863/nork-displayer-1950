const stateFront = {
  isFirstLoad: true,
  scrapeId: null,
  eventTrigger: null,

  typeTrigger: "articles", //default articles
  articleType: "fatboy", //default fatboy
  picType: "all",
  vidType: "vidPages",
  howMany: null,
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

export default stateFront;
