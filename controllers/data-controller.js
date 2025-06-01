import { runGetBackendData, getNewArticleData, getNewPicData, getNewVidData } from "../src/src-main.js";
import { runAdminSubmit } from "../src/src-admin.js";

//passes everything to admin src
export const adminSubmitRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await runAdminSubmit(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process admin command" });
  }
};

//get data from backend for display
export const getBackendDataRoute = async (req, res) => {
  const inputParams = req.body;

  try {
    const data = await runGetBackendData(inputParams);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get backend data" });
  }
};

export const getNewArticleDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await getNewArticleData(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process admin command" });
  }
};

export const getNewPicDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await getNewPicData(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process admin command" });
  }
};

export const getNewVidDataRoute = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await getNewVidData(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to process admin command" });
  }
};
