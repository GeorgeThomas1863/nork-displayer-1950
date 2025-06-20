// import { runGetBackendData, runGetNewData, getNewArticleData, getNewPicData, getNewVidData } from "../src/src-main.js";
import { runGetBackendData } from "../src/src-main.js";
import { runGetAdminBackendData, runAdminSubmit } from "../src/src-admin.js";

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
  try {
    const inputParams = req.body;

    const data = await runGetBackendData(inputParams);
    return res.json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get backend data" });
  }
};

// export const getNewDataRoute = async (req, res) => {
//   try {
//     const inputParams = req.body;

//     const data = await runGetNewData(inputParams);
//     return res.json(data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to get new data" });
//   }
// };

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

//=---------------------------

// export const getNewArticleDataRoute = async (req, res) => {
//   try {
//     const inputParams = req.body;

//     const data = await getNewArticleData(inputParams);
//     return res.json(data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to process admin command" });
//   }
// };

// export const getNewPicDataRoute = async (req, res) => {
//   try {
//     const inputParams = req.body;

//     const data = await getNewPicData(inputParams);
//     return res.json(data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to process admin command" });
//   }
// };

// export const getNewVidDataRoute = async (req, res) => {
//   try {
//     const inputParams = req.body;

//     const data = await getNewVidData(inputParams);
//     return res.json(data);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: "Failed to process admin command" });
//   }
// };
