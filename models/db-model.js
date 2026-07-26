//import mongo
import { dbGet } from "../middleware/db-config.js";
import { ObjectId } from "mongodb";

class dbModel {
  constructor(dataObject, collection) {
    this.dataObject = dataObject;
    this.collection = collection;
  }

  //STORE STUFF

  async storeAny() {
    // await db.dbConnect();
    const storeData = await dbGet().collection(this.collection).insertOne(this.dataObject);
    return storeData;
  }

  async storeUniqueURL() {
    // await db.dbConnect();
    await this.urlNewCheck(); //check if new

    const storeData = await this.storeAny();
    return storeData;
  }

  //------------------

  //GET STUFF

  async getAll(limit = 0) {
    const cursor = dbGet().collection(this.collection).find();
    return await (limit > 0 ? cursor.limit(limit) : cursor).toArray();
  }

  async countAll() {
    return await dbGet().collection(this.collection).countDocuments({});
  }

  async getUniqueItem() {
    const { keyToLookup, itemValue } = this.dataObject;
    const dataArray = await dbGet().collection(this.collection).findOne({ [keyToLookup]: itemValue }); //prettier-ignore
    return dataArray;
  }

  //unique array
  async getUniqueArray() {
    const { keyToLookup, itemValue } = this.dataObject;
    const mongoValue = new ObjectId(itemValue); //convert to mongoId

    const dataArray = await dbGet().collection(this.collection).find({ [keyToLookup]: mongoValue }).toArray(); //prettier-ignore
    return dataArray;
  }

  //data for single scrape
  async getScrapeData() {
    const { scrapeId } = this.dataObject;
    const mongoValue = new ObjectId(scrapeId); //convert to mongoId

    const scrapeData = await dbGet().collection(this.collection).findOne({ _id: mongoValue }); //prettier-ignore
    return scrapeData;
  }

  //------------------------------

  //get NEWEST items return as array
  async getNewestItemsArray() {
    const { sortKey, sortKey2, howMany } = this.dataObject;

    //get data
    const dataArray = await dbGet().collection(this.collection).find().sort({ [sortKey]: -1, [sortKey2]: -1 }).limit(+howMany).toArray(); //prettier-ignore

    return dataArray;
  }

  //OLD VERSION WITH SECOND SORT KEY
  // async getNewestItemsByTypeArray() {
  //     const { sortKey, sortKey2, howMany, filterKey, filterValue } = this.dataObject;

  //     //get data
  //     const dataArray = await dbGet().collection(this.collection).find({ [filterKey]: filterValue }).sort({ [sortKey]: -1, [sortKey2]: -1 }).limit(+howMany).toArray(); //prettier-ignore

  //     return dataArray;
  // }

  async getNewestItemsByTypeArray() {
    const { sortKey, howMany, filterKey, filterValue } = this.dataObject;

    // console.log("INPUT OBJECT");
    // console.log(this.dataObject);

    //get data
    const dataArray = await dbGet().collection(this.collection).find({ [filterKey]: filterValue }).sort({ [sortKey]: -1}).limit(+howMany).toArray(); //prettier-ignore

    return dataArray;
  }

  //get OLDEST ITEMS
  async getOldestItemsArray() {
    const { sortKey, sortKey2, howMany } = this.dataObject;

    //get data
    const dataArray = await dbGet().collection(this.collection).find().sort({ [sortKey]: 1, [sortKey2]: 1 }).limit(+howMany).toArray(); //prettier-ignore

    return dataArray;
  }

  //get last items by TYPE (for articles)
  async getOldestItemsByTypeArray() {
    const { sortKey, sortKey2, howMany, filterKey, filterValue } = this.dataObject;

    //get data
    const dataArray = await dbGet().collection(this.collection).find({ [filterKey]: filterValue }).sort({ [sortKey]: 1, [sortKey2]: 1 }).limit(+howMany).toArray(); //prettier-ignore

    return dataArray;
  }

  //get items sorted by a prebuilt sort object (admin log table)
  async getSortedItemsArray() {
    const { sortObj, howMany } = this.dataObject;

    //get data
    const dataArray = await dbGet().collection(this.collection).find().sort(sortObj).limit(+howMany).toArray(); //prettier-ignore

    return dataArray;
  }

  //aggregate active/finished/error counts and average duration (admin log stats bar)
  async getLogStatsSummary() {
    const pipeline = [
      {
        $group: {
          _id: null,
          activeScrapes: { $sum: { $cond: [{ $eq: ["$scrapeActive", true] }, 1, 0] } },
          errorScrapes: { $sum: { $cond: [{ $eq: ["$scrapeError", true] }, 1, 0] } },
          finishedScrapes: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$scrapeEndTime", null] }, { $ne: ["$scrapeError", true] }] },
                1,
                0,
              ],
            },
          },
          avgDuration: { $avg: "$scrapeLengthSeconds" },
        },
      },
    ];

    const results = await dbGet().collection(this.collection).aggregate(pipeline).toArray();
    if (results.length === 0) {
      return { activeScrapes: 0, finishedScrapes: 0, errorScrapes: 0, avgDuration: 0 };
    }

    const { activeScrapes, finishedScrapes, errorScrapes, avgDuration } = results[0];
    return { activeScrapes, finishedScrapes, errorScrapes, avgDuration: Math.round(avgDuration || 0) };
  }
}

export default dbModel;
