import { sendToBack } from "./util.js";

//get display element
const displayElement = document.getElementById("display-element");

export const buildDefaultDisplay = async () => {
  displayElement.innerHTML = `
        <h1>ALLAHU AKBAR</h1>
    `;

  //get backend data FIRST
  const backendDataObj = await sendToBack({ route: "/get-backend-data-route" });
  const { articleData, picSetData, vidPageData } = backendDataObj;

  //build drop down

  //build input forms
};

buildDefaultDisplay();
