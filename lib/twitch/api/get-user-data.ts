export const getTwitchUserData = async (token: string) => {
  const response = await fetch("https://api.twitch.tv/helix/users", {
    headers: {
      Authorization: token,
      "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
    },
  }).then((response) => response.json());

  return response;
};
