import { sendToBack } from "./util.js";

//get display element
const displayElement = document.getElementById("display-element");

export const buildDefaultDisplay = async () => {
  displayElement.innerHTML = `
        <h1>ALLAHU AKBAR</h1>
    `;

  //get backend data FIRST
  const backendDataObj = await getBackendData();

  //build drop down

  //build input forms
};

//get and parse backend data
const getBackendData = async () => {
  //get backend data
  const dataObjRaw = await sendToBack({ route: "/get-backend-data-route" });

  console.log("RAW BACKEND DATA");
  console.log(dataObjRaw);

  //pase backend data
};

buildDefaultDisplay();
