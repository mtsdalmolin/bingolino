export const postStreamerItem =
  (streamerName: string) => async (payload: unknown) => {
    const response = await fetch(`/api/bingo/items/${streamerName}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((response) => response.json());

    return response;
  };
