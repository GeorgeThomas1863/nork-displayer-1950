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
  // const { stateAdmin } = req.body;

  const data = await runGetAdminData();
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

const isValidCommandRequest = (inputParams) => {
  if (!isPlainObject(inputParams)) return false;
  return typeof inputParams.command === "string" && inputParams.command.trim().length > 0;
};

const isValidPollingRequest = (inputParams) => {
  if (!isPlainObject(inputParams)) return false;
  const { scrapeId } = inputParams;
  return scrapeId == null || typeof scrapeId === "string";
};

const isPlainObject = (inputData) => {
  return inputData !== null && typeof inputData === "object" && !Array.isArray(inputData);
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
