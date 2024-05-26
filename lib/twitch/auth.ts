// https://id.twitch.tv/oauth2/authorize?client_id=i96vj5clpiy41hjciatba390t6tkto&force_verify=true&redirect_uri=https%3A%2F%2Fbingolino.vercel.app%2F&response_type=token&scope=user_read

export const getTwitchAuthLink = () =>
  `https://id.twitch.tv/oauth2/authorize?client_id=${process.env.TWITCH_CLIENT_ID}&force_verify=true&redirect_uri=${process.env.TWITCH_REDIRECT_URL}&response_type=token&scope=user_read`;
