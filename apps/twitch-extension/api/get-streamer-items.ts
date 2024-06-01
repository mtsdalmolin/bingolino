export const getStreamerItems = (streamerName: string) => async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BINGOLINO_URL}/api/bingo/items/${streamerName}`
  ).then((response) => response.json());

  return response;
};
