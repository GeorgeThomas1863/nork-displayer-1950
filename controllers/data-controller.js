// import { runGetBackendData, runGetNewData, getNewArticleData, getNewPicData, getNewVidData } from "../src/src-main.js";
import { runGetBackendData } from "../src/src-main.js";
import { runGetDefaultDataAdmin } from "../src/src-admin.js";
import { sendAdminUpdate } from "../src/api-back.js";

//get data from backend for display
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

//------------------------------------

export const getDefaultDataAdminRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await runGetDefaultDataAdmin(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get admin backend data" });
  }
};

//since get req just sen from here
export const getUpdateDataAdminRoute = async (req, res) => {
  try {
    const data = await sendAdminUpdate();
    return res.json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "Failed to get update data" });
  }
};
