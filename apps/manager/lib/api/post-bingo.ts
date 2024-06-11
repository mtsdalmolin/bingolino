export const postBingo =
  (streamerName: string) => async (dimensions: number) => {
    const response = await fetch(`/api/bingo/${streamerName}`, {
      method: "POST",
      body: JSON.stringify({ dimensions }),
    }).then((response) => response.json());

    return response;
  };
