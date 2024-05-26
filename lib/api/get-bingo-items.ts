export const getBingoItems = (streamerName: string) => async () => {
  const response = await fetch(`/api/bingo/${streamerName}`).then((response) =>
    response.json()
  );

  return response;
};
