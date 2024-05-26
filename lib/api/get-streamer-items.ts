export const getStreamerItems = async () => {
  const response = await fetch("/api/bingo/items/inoxville").then((response) =>
    response.json()
  );

  return response;
};
