import { runGetBackendData, getNewArticleData } from "../src/src-main.js";
import { runAdminSubmit } from "../src/src-admin.js";

//passes everything to main src
export const getBackendDataRoute = async (req, res) => {
  try {
    const data = await runGetBackendData();
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
