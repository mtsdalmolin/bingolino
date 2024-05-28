export const getTwitchUserData = async (token: string, tokenType: string) => {
  const response = await fetch(
    `/api/twitch/get-user-data?twitchToken=${token}&tokenType=${tokenType}`
  ).then((response) => response.json());

  return response;
};
