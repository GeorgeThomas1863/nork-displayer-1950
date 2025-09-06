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
