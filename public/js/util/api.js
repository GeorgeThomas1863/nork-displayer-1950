import CONFIG_PUBLIC from "/config-public.js";

export const sendScrapeCommand = async (params) => {
  const { api } = CONFIG_PUBLIC;

  console.log("PARAMS");
  console.dir(params);

  try {
    const res = await fetch(api, {
      method: "POST",
      body: JSON.stringify(params),
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
