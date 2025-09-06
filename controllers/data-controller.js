import { sendAdminCommand } from "../src/api-back.js";

export const adminDataRouteController = async (req, res) => {
  try {
    const inputParams = req.body;

    const data = await sendAdminCommand(inputParams);
    return res.json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "Failed to get admin backend data" });
  }
};
