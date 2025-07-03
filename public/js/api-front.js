import d from "./define-things.js";

//CANNOT USE AXIOS HERE (just for backend / much harder, just use fetch)
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

export const sendToBackAdmin = async (inputParams, onUpdate) => {
  const { route } = inputParams;

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
        const updateRoute = "/get-admin-update-data-route";
        const updateRes = await fetch(updateRoute, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const updateData = await updateRes.json();

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
