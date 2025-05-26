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

export const buildAdminParams = async () => {
  const params = {
    route: "/admin-submit-route",
    commandType: document.getElementById("admin-command-type").value,
    howMuch: document.getElementById("admin-how-much").value,
    urlInput: document.getElementById("admin-url-input").value,
    itemType: document.getElementById("admin-item-type").value,
    articleType: document.getElementById("admin-article-type").value,
    uploadTG: document.getElementById("admin-upload-tg").value,
    tgId: document.getElementById("admin-tgId").value,
  };
  return params;
};
