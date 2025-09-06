import { hideArray, unhideArray } from "../util/util.js";

export const changeAdminForm = async () => {
  const howMuchElement = document.getElementById("admin-how-much");
  const urlListItem = document.getElementById("admin-url-input-list-item");
  if (!howMuchElement || !urlListItem) return null;

  console.log("HOW MUCH ELEMENT");
  console.log(howMuchElement);

  console.log("HOW MUCH VALUE");
  console.log(howMuchElement.value);

  howMuchElement.value === "admin-scrape-url" ? unhideArray([urlListItem]) : hideArray([urlListItem]);

  return true;
};
