export const postStreamerItem = async (payload: unknown) => {
  const response = await fetch("/api/bingo/items/inoxville", {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((response) => response.json());

  return response;
};
