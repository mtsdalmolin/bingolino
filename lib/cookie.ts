export const BINGO_COOKIE_NAME = "@bingolino:bingo";
export const TWITCH_TOKEN = "@bingolino:twitch-token";
export const TWITCH_USER_DATA = "@bingolino:twitch-user-data";

export function setBingoCookie(cookieValue: string, expires: string) {
  document.cookie = `${BINGO_COOKIE_NAME}=${cookieValue};${expires};path=/`;
}

export function setCookie(
  cookieName: string,
  cookieValue: string,
  expires?: string
) {
  document.cookie = `${cookieName}=${cookieValue};${expires + ";"}path=/`;
}

export function getCookie(cookieName: string) {
  const currentCookies = document.cookie.split(";");
  for (var i = 0; i < currentCookies.length; i++) {
    let cookie = currentCookies[i];
    while (cookie.charAt(0) == " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) == 0) {
      return cookie.substring(cookieName.length + 1, cookie.length);
    }
  }
  return "";
}

export function isBingoCookieSet() {
  return !!getCookie(BINGO_COOKIE_NAME);
}
