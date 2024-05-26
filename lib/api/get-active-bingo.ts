export const getActiveBingoId = async () => {
  const response = await fetch("/api/bingo/inoxville/active").then((response) =>
    response.json()
  );

  return response[0].bingoId;
};
