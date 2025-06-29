// import { runGetBackendData, runGetNewData, getNewArticleData, getNewPicData, getNewVidData } from "../src/src-main.js";
import { runGetBackendData } from "../src/src-main.js";
import { runGetAdminBackendData } from "../src/src-admin.js";

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

export const getAdminBackendDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await runGetAdminBackendData(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get admin backend data" });
  }
};
