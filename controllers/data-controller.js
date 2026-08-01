import { runUpdateDisplayData } from "../src/main-back.js";
import { runAdminCommand, runGetAdminData } from "../src/admin-back.js";

export const updateDisplayDataController = async (req, res) => {
  const { stateFront } = req.body;

  const data = await runUpdateDisplayData(stateFront);
  return res.json(data);
};

//--------------------

//send admin command
export const adminCommandController = async (req, res) => {
  const inputParams = req.body;
  if (!isValidCommandRequest(inputParams)) {
    return sendBadRequest(res, "Invalid admin command request");
  }

  const result = await runAdminCommand(inputParams);
  return sendOperationResult(res, result);
};

export const adminDataController = async (req, res) => {
  const sortParams = buildSortParams(req.body);

  const data = await runGetAdminData(sortParams);
  if (!data) return sendAdminDataFailure(res);
  return res.json(data);
};

export const adminPollingController = async (req, res) => {
  if (!isValidPollingRequest(req.body)) {
    return sendBadRequest(res, "Invalid admin polling request");
  }

  const inputParams = buildStatusParams(req.body);
  const result = await runAdminCommand(inputParams);
  return sendOperationResult(res, result);
};

const ADMIN_COMMAND_WHITELIST = ["admin-start-scrape", "admin-stop-scrape", "admin-start-scheduler", "admin-stop-scheduler", "admin-scrape-status"];

const isValidCommandRequest = (inputParams) => {
  if (!isPlainObject(inputParams)) return false;
  return ADMIN_COMMAND_WHITELIST.includes(inputParams.command);
};

const isValidPollingRequest = (inputParams) => {
  if (!isPlainObject(inputParams)) return false;
  const { scrapeId } = inputParams;
  return scrapeId == null || typeof scrapeId === "string";
};

const isPlainObject = (inputData) => {
  return inputData !== null && typeof inputData === "object" && !Array.isArray(inputData);
};

const SORT_COLUMN_WHITELIST = ["id", "status", "startTime", "endTime", "duration", "step", "message", "active"];
const SORT_DIR_WHITELIST = ["asc", "desc"];

const sanitizeSortColumn = (sortColumn) => {
  return SORT_COLUMN_WHITELIST.includes(sortColumn) ? sortColumn : "endTime";
};

const sanitizeSortDir = (sortDir) => {
  return SORT_DIR_WHITELIST.includes(sortDir) ? sortDir : "desc";
};

const buildSortParams = (inputParams) => {
  const { sortColumn, sortDir } = isPlainObject(inputParams) ? inputParams : {};
  return { sortColumn: sanitizeSortColumn(sortColumn), sortDir: sanitizeSortDir(sortDir) };
};

const buildStatusParams = (inputParams) => {
  const { scrapeId } = inputParams;
  return { command: "admin-scrape-status", scrapeId };
};

const sendAdminDataFailure = (res) => {
  const result = { success: false, message: "Unable to load admin data", data: { status: 503 } };
  return res.status(503).json(result);
};

const sendBadRequest = (res, message) => {
  const result = { success: false, message, data: { status: 400 } };
  return res.status(400).json(result);
};

const sendOperationResult = (res, result) => {
  if (result?.success) return res.json(result);
  const status = result?.data?.status || 502;
  return res.status(status).json(result);
};
