import kcnaState from "../src/kcna/state-kcna.js";

//api receive endpoint for displayer
export const apiEndpointController = async (req, res) => {
  try {
    const inputParams = req.body;

    console.log("API INCOMING DATA");
    console.log(inputParams);

    //ignore everything not from scraper
    if (inputParams.source !== "scraper") return null;

    // other update method, could be easier / better
    // delete inputParams.source;
    // kcnaState = inputParams;

    //update state with loop
    const { [inputParams.source]: _, ...updateObj } = inputParams;
    for (let key in updateObj) {
      if (updateObj[key] === null) continue;
      kcnaState[key] = updateObj[key];
    }

    return res.json(kcnaState);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e: "DISPLAYER FAILED TO GET INCOMING API DATA" });
  }
};
