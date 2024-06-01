export const getActiveBingo = (streamerName: string) => async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BINGOLINO_URL}/api/bingo/${streamerName}/active`
  ).then((response) => response.json());

  return response[0];
};
