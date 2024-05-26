export const patchBingoItem = async (payload: unknown) => {
  const response = await fetch("/api/bingo/items/inoxville", {
    method: "PATCH",
    body: JSON.stringify(payload),
  }).then((response) => response.json());

  return response;
};
