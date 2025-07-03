// import { runGetBackendData, runGetNewData, getNewArticleData, getNewPicData, getNewVidData } from "../src/src-main.js";
import { runGetBackendData } from "../src/src-main.js";
import { runAdminGetDefaultData, runAdminGetUpdateData } from "../src/src-admin.js";

//get data from backend for displa
export const getBackendDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await runGetBackendData(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get backend data" });
  }
};

export const getAdminDefaultDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await runAdminGetDefaultData(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get admin backend data" });
  }
};

export const getAdminUpdateDataRoute = async (req, res) => {
  try {
    const data = await runAdminGetUpdateData();
    return res.json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "Failed to get update data" });
  }
};
