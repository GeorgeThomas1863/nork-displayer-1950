import axios from "axios";
import CONFIG from "../config/config.js";
import kcnaState from "../src/kcna/state-kcna.js";
import { runUpdateDisplayData } from "../src/main-back.js";
import { runAdminCommand, runAdminCurrentData } from "../src/admin-back.js";

export const getBackendValueController = async (req, res) => {
  const { key } = req.body;
  if (!key) return null;

  const value = CONFIG[key];

  return res.json({ value });
};

export const updateDisplayDataController = async (req, res) => {
  const { stateFront } = req.body;

  const data = await runUpdateDisplayData(stateFront);
  return res.json(data);
};

//--------------------

//send admin command
export const adminCommandController = async (req, res) => {
  const inputParams = req.body;
  if (!inputParams) return null;

  const data = await runAdminCommand(inputParams);
  return res.json(data);
};

export const adminCurrentDataController = async (req, res) => {};

export const adminPollingController = async (req, res) => {
  // const inputParams = req.body;
  // if (!inputParams) return null;
  const stateData = kcnaState;

  return res.json(stateData);
};
