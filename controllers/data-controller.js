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
  if (!inputParams) return res.status(400).json({ error: "Bad request" });

  const data = await runAdminCommand(inputParams);
  return res.json(data);
};

export const adminDataController = async (req, res) => {
  // const { stateAdmin } = req.body;

  const data = await runGetAdminData();
  // const data = await getAdminLogs()
  return res.json(data);
};

export const adminPollingController = async (req, res) => {
  res.status(501).json({ error: "Not implemented" });
};
