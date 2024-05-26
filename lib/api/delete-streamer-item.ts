export const deleteStreamerItem = async (payload: unknown) => {
  const response = await fetch("/api/bingo/items/inoxville", {
    method: "DELETE",
    body: JSON.stringify(payload),
  }).then((response) => response.json());

  return response;
};
