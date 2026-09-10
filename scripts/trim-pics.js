import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { MongoClient } from "mongodb";

import { selectCandidates } from "./trim-pics-select.js";

dotenv.config();

const REQUIRED_CONFIG_KEYS = ["PIC_PATH", "MONGO_URI", "DB_NAME"];

const parseArguments = (args) => {
  const options = { orphans: false, olderThanDays: null, delete: false };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--orphans") {
      options.orphans = true;
      continue;
    }
    if (argument === "--delete") {
      options.delete = true;
      continue;
    }
    if (argument === "--older-than") {
      options.olderThanDays = parseOlderThanDays(args[index + 1]);
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${argument}`);
  }

  if (!options.orphans && options.olderThanDays === null) {
    throw new Error("Specify --orphans, --older-than <days>, or both.");
  }

  return options;
};

const parseOlderThanDays = (value) => {
  const days = Number(value);
  if (!Number.isFinite(days) || days < 0) {
    throw new Error("--older-than requires a non-negative number of days.");
  }

  return days;
};

const readConfig = () => {
  const config = {
    picPath: process.env.PIC_PATH,
    mongoUri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  };
  const values = [config.picPath, config.mongoUri, config.dbName];

  for (let index = 0; index < REQUIRED_CONFIG_KEYS.length; index += 1) {
    if (values[index]) continue;
    throw new Error(`Missing required environment variable: ${REQUIRED_CONFIG_KEYS[index]}`);
  }

  return config;
};

const readPicFiles = async (picPath) => {
  let entries;
  try {
    entries = await fs.readdir(picPath, { withFileTypes: true });
  } catch (error) {
    throw new Error(`Failed to read PIC_PATH directory: ${error.message}`);
  }

  const files = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const file = await readFileRecord(picPath, entry.name);
    files.push(file);
  }

  return files;
};

const readFileRecord = async (picPath, name) => {
  const filePath = path.join(picPath, name);
  try {
    const stats = await fs.stat(filePath);
    return { name, path: filePath, size: stats.size, mtimeMs: stats.mtimeMs };
  } catch (error) {
    throw new Error(`Failed to inspect pic file ${name}: ${error.message}`);
  }
};

const readReferencedFilenames = async (client, dbName) => {
  let documents;
  try {
    documents = await client.db(dbName).collection("pics").find({}, { projection: { picName: 1, savePath: 1 } }).toArray();
  } catch (error) {
    throw new Error(`Failed to read references from the pics collection: ${error.message}`);
  }

  const referenced = new Set();
  for (const document of documents) {
    addReferencedFilename(referenced, document.picName);
    addReferencedFilename(referenced, document.savePath);
  }

  return referenced;
};

const addReferencedFilename = (referenced, value) => {
  if (typeof value !== "string" || value.length === 0) return;
  const normalized = value.replaceAll("\\", "/");
  referenced.add(path.posix.basename(normalized));
};

const connectToMongo = async (mongoUri) => {
  const client = new MongoClient(mongoUri);
  try {
    await client.connect();
    return client;
  } catch (error) {
    await closeMongoAfterFailure(client);
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
};

const closeMongoAfterFailure = async (client) => {
  try {
    await client.close();
  } catch (error) {
    console.error(`Failed to close MongoDB after connection error: ${error.message}`);
  }
};

const closeMongo = async (client) => {
  if (!client) return;
  try {
    await client.close();
  } catch (error) {
    throw new Error(`Failed to close MongoDB connection: ${error.message}`);
  }
};

const buildLogPath = () => {
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  return path.resolve(".claude", ".tmp", `trim-pics-${timestamp}.log`);
};

const writeCandidateLog = async (candidates) => {
  const logPath = buildLogPath();
  const logDirectory = path.dirname(logPath);
  const lines = [];
  for (const candidate of candidates) lines.push(candidate.path);

  try {
    await fs.mkdir(logDirectory, { recursive: true });
    await fs.writeFile(logPath, `${lines.join("\n")}${lines.length ? "\n" : ""}`, "utf8");
    return logPath;
  } catch (error) {
    throw new Error(`Failed to write candidate log: ${error.message}`);
  }
};

const calculateTotalBytes = (candidates) => {
  let totalBytes = 0;
  for (const candidate of candidates) totalBytes += candidate.size;
  return totalBytes;
};

const printSummary = (candidates, logPath, shouldDelete) => {
  const totalMb = calculateTotalBytes(candidates) / (1024 * 1024);
  console.log(`Candidates: ${candidates.length}`);
  console.log(`Total size: ${totalMb.toFixed(2)} MB`);
  console.log(`Candidate list: ${logPath}`);
  console.log(shouldDelete ? "Mode: delete" : "Mode: dry-run (no files deleted)");
};

const deleteCandidates = async (candidates) => {
  for (const candidate of candidates) await deleteCandidate(candidate);
};

const deleteCandidate = async (candidate) => {
  try {
    await fs.unlink(candidate.path);
  } catch (error) {
    throw new Error(`Failed to delete pic file ${candidate.name}: ${error.message}`);
  }
};

const run = async () => {
  const options = parseArguments(process.argv.slice(2));
  const config = readConfig();
  let client = null;

  try {
    const files = await readPicFiles(config.picPath);
    client = await connectToMongo(config.mongoUri);
    const referenced = await readReferencedFilenames(client, config.dbName);
    const candidates = selectCandidates(files, referenced, options);
    const logPath = await writeCandidateLog(candidates);
    printSummary(candidates, logPath, options.delete);
    if (options.delete) await deleteCandidates(candidates);
  } finally {
    await closeMongo(client);
  }
};

try {
  await run();
} catch (error) {
  console.error(`Pic trimming failed: ${error.message}`);
  process.exitCode = 1;
}
