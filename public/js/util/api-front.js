export const sendToBack = async (inputParams) => {
  const { route } = inputParams;

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
    console.log("DATA");
    console.dir(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
