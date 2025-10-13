export const sendToBackGET = async (inputParams) => {
  const { route } = inputParams;

  try {
    const res = await fetch(route);

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const sendToBackPOST = async (inputParams) => {
  const { route } = inputParams;

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
