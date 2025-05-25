//import mongo
import * as db from "../data/db.js";
import { ObjectId } from "mongodb";

//connect to db AGAIN here just to be safe
await db.dbConnect();

class dbModel {
  constructor(dataObject, collection) {
    this.dataObject = dataObject;
    this.collection = collection;
  }

  //STORE STUFF

  async storeAny() {
    // await db.dbConnect();
    const storeData = await db.dbGet().collection(this.collection).insertOne(this.dataObject);
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
    const arrayData = await db.dbGet().collection(this.collection).find().toArray();
    return arrayData;
  }

  async getUniqueItem() {
    const { keyToLookup, itemValue } = this.dataObject;
    const dataArray = await db.dbGet().collection(this.collection).findOne({ [keyToLookup]: itemValue }); //prettier-ignore
    return dataArray;
  }

  //unique array
  async getUniqueArray() {
    const { keyToLookup, itemValue } = this.dataObject;
    const mongoValue = new ObjectId(itemValue); //unsure why necessary, but THIS is key step

    const dataArray = await db.dbGet().collection(this.collection).find({ [keyToLookup]: mongoValue }).toArray(); //prettier-ignore
    return dataArray;
  }

  //get last items return as array
  async getLastItemsArray() {
    const { sortKey, howMany } = this.dataObject;

    //get data
    const dataArray = await db.dbGet().collection(this.collection).find().sort({ [sortKey]: -1 }).limit(+howMany).toArray(); //prettier-ignore

    return dataArray;
  }

  //get last items by TYPE (for articles)
  async getLastItemsByTypeArray() {
    const { sortKey, howMany, filterKey, filterValue } = this.dataObject;

    //get data
    const dataArray = await db.dbGet().collection(this.collection).find({[filterKey]: filterValue }).sort({ [sortKey]: -1 }).limit(+howMany).toArray(); //prettier-ignore

    return dataArray;
  }
}

export default dbModel;
