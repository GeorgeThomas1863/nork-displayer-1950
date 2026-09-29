import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"], quiet: true });

import { MongoClient } from "mongodb";

let db;

export const dbConnect = async () => {
  //connect to mongo server
  const client = await MongoClient.connect(process.env.MONGO_URI);
  db = client.db(process.env.DB_NAME);
};

//create function to call database outside file
export const dbGet = () => {
  //ensure db connection is working
  if (!db) {
    throw { message: "Database connection fucked" };
  }
  return db;
};

//indexes that back the sorted display queries in models/db-model.js
const INDEXES = [
  { collection: "articles", keys: { date: -1, articleId: -1 } },
  { collection: "articles", keys: { articleType: 1, date: -1, articleId: -1 } },
  { collection: "pics", keys: { date: -1, picId: -1 } },
  { collection: "picSets", keys: { date: -1, picSetId: -1 } },
  { collection: "watch", keys: { site: 1, date: -1, vidPageId: -1 } },
];

//create any missing indexes on startup so display queries stop full-scanning + sorting in memory
export const ensureIndexes = async (db = dbGet()) => {
  let failCount = 0;

  for (let i = 0; i < INDEXES.length; i++) {
    const { collection: collectionName, keys } = INDEXES[i];

    try {
      await db.collection(collectionName).createIndex(keys);
    } catch (e) {
      console.error(`ensureIndexes: failed on collection "${collectionName}" keys ${JSON.stringify(keys)}: ${e.message}`);
      failCount++;
    }
  }

  const okCount = INDEXES.length - failCount;
  return { success: failCount === 0, message: `${okCount}/${INDEXES.length} indexes ensured` };
};
