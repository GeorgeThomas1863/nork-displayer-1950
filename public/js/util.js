import axios from "axios";

export const sendToBack = async (inputParams) => {
  const { route } = inputParams;

  console.log("INPUT PARAMS");
  console.log(inputParams);

  //send all to backend
  try {
    const res = await axios.post(route, inputParams);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
