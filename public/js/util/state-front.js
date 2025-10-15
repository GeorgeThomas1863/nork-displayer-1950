const stateFront = {
  isFirstLoad: true,
  scrapeId: null,
  eventTrigger: null,

  typeTrigger: "articles", //default articles
  articleType: "fatboy", //default fatboy
  picType: "pics",
  vidType: "vids",
  dataObj: {
    articles: null,
    pics: null,
    vids: null,
  },
};

export default stateFront;
