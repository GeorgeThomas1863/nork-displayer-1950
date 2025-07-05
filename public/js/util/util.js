export const hideArray = async (inputs) => {
  for (const input of inputs) {
    if (!input) continue;
    input.classList.add("hidden");
  }
};

export const unhideArray = async (inputs) => {
  for (const input of inputs) {
    if (!input) continue;
    input.classList.remove("hidden");
  }
};

//debounce function (to add delay to input / only send to back when user stops typing) [can put elsewhere]
export const debounce = (func) => {
  let timer;
  const DELAY = 300; //300 milliseconds

  //method for creating new promise, so can use with async await
  return (...args) => {
    return new Promise((resolve, reject) => {
      // Cancel any pending execution
      clearTimeout(timer);

      // Schedule new execution
      timer = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, DELAY);
    });
  };
};
