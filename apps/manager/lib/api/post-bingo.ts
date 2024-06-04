export const postBingo = (streamerName: string) => async () => {
  const response = await fetch(`/api/bingo/${streamerName}`, {
    method: "POST",
  }).then((response) => response.json());

  return response;
};
