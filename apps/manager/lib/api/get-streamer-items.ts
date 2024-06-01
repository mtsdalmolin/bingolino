export const getStreamerItems = (streamerName: string) => async () => {
  const response = await fetch(`/api/bingo/items/${streamerName}`).then(
    (response) => response.json()
  );

  return response;
};
