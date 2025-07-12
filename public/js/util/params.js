export const buildAdminParams = async () => {
  const params = {
    route: "/admin-submit-route",
    appType: document.getElementById("admin-app-type").value,
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
    articleHowMany: Number(document.getElementById("article-how-many").value),
    articleSortBy: document.getElementById("article-sort-by").value,
    picHowMany: Number(document.getElementById("pic-how-many").value),
    picSortBy: document.getElementById("pic-sort-by").value,
    vidHowMany: Number(document.getElementById("vid-how-many").value),
    vidSortBy: document.getElementById("vid-sort-by").value,
  };

  return params;
};
