export const getBingoItems = async () => {
  const response = await fetch("/api/bingo/inoxville").then((response) =>
    response.json()
  );

  return response;
};
