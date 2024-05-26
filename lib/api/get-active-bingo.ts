export const getActiveBingoId = (streamerName: string) => async () => {
  const response = await fetch(`/api/bingo/${streamerName}/active`).then(
    (response) => response.json()
  );

  return response[0].bingoId;
};
