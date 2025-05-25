//CANNOT USE AXIOS HERE (just for backend / much harder, just use fetch)
export const sendToBack = async (inputParams) => {
  const { route } = inputParams;

  console.log("INPUT PARAMS");
  console.log(inputParams);

  //send all to backend
  try {
    const res = await fetch(route, {
      method: "POST",
      body: JSON.stringify(inputParams),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
