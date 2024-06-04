export const deleteStreamerItem =
  (streamerName: string) => async (payload: unknown) => {
    const response = await fetch(`/api/bingo/items/${streamerName}`, {
      method: "DELETE",
      body: JSON.stringify(payload),
    }).then((response) => response.json());

    return response;
  };
