//import mongo
import { dbConnect, dbGet } from "../config/db.js";
import { ObjectId } from "mongodb";

//connect to db AGAIN here just to be safe
await dbConnect();

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

  async getAll() {
    const arrayData = await dbGet().collection(this.collection).find().toArray();
    return arrayData;
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

    console.log("INPUT OBJECT");
    console.log(this.dataObject);

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
}

export default dbModel;
