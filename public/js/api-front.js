import d from "./define-things.js";

//FOR MAIN
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
    return data;
  } catch (error) {
    console.log(error);
  }
};

//FOR ADMIN
export const sendToBackAdmin = async (inputParams, onUpdate) => {
  const { route } = inputParams;

  console.log("SEND TO BACK ADMIN");
  console.dir(inputParams);

  // Send initial request to backend (starts the scraping process)
  try {
    const res = await fetch(route, {
      method: "POST",
      body: JSON.stringify(inputParams),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const initialData = await res.json();

    // Start polling for updates from the frontend
    const pollInterval = setInterval(async () => {
      try {
        const updateRoute = "/get-update-data-admin-route";
        const updateRes = await fetch(updateRoute, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const updateData = await updateRes.json();

        console.log("UPDATE DATA");
        console.dir(updateData);

        // Call the callback with update data
        onUpdate(updateData);

        if (updateData.finished) {
          clearInterval(pollInterval);
        }
      } catch (e) {
        console.log("Error polling for updates", e);
      }
    }, d.updateInterval);

    return initialData;
  } catch (error) {
    console.log(error);
    return null;
  }
};
