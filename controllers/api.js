import { runGetBackendData } from "../src/src-main.js";

//passes everything to src
export const getBackendDataRoute = async (req, res) => {
  try {
    const data = await runGetBackendData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get backend data" });
  }
};
