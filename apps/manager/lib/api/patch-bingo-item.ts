export const patchBingoItem =
  (streamerName: string) => async (payload: unknown) => {
    const response = await fetch(`/api/bingo/items/${streamerName}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }).then((response) => response.json());

    return response;
  };
