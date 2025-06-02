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

export const buildInputParams = async () => {
  const params = {
    route: "/new-data-route",
    articleType: document.getElementById("article-type").value,
    articleHowMany: Number(document.getElementById("article-how-many").value) || 5,
    articleSortBy: document.getElementById("article-sort-by").value,
    picType: document.getElementById("pic-type").value,
    picHowMany: Number(document.getElementById("pic-how-many").value) || 9,
    picSortBy: document.getElementById("pic-sort-by").value,
    vidType: document.getElementById("vid-type").value,
    vidHowMany: Number(document.getElementById("vid-how-many").value) || 3,
    vidSortBy: document.getElementById("vid-sort-by").value,
  };

  return params;
};

//--------------------------------

export const hideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.add("hidden");
  }
};

export const unhideArray = async (inputs) => {
  for (const input of inputs) {
    input.classList.remove("hidden");
  }
};

//--------------------------------

//debounce function (to add delay to input / only send to back when user stops typing) [can put elsewhere]
export const debounce = (func) => {
  let timer;
  const DELAY = 300; //300 milliseconds

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), DELAY);
  };
};

//----------------------------------

export const checkNewDataTrigger = async (inputObj) => {
  const { clickId, expandType, inputId } = inputObj;

  for (let i = 0; i < d.clickTriggerArr.length; i++) {
    if (clickId === d.clickTriggerArr[i]) {
      return true;
    }
  }

  for (let i = 0; i < d.expandTriggerArr.length; i++) {
    if (expandType === d.expandTriggerArr[i]) {
      return true;
    }
  }

  //MIGHT NOT BE NEEDED
  for (let i = 0; i < d.inputTriggerArr.length; i++) {
    if (inputId === d.inputTriggerArr[i]) {
      return true;
    }
  }

  return false;
};

export const buildFailElement = async () => {
  const failElement = document.createElement("h1");
  failElement.innerHTML = "BACKEND DATA LOOKUP FUCKED";
  failElement.id = "backend-data-fail";
  return failElement;
};
