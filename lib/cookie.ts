import { getTomorrowDate } from "./date";

export const BINGO_COOKIE_NAME = "@bingolino:bingo";
export const BINGO_COOKIE_EXPIRES = "@bingolino:expires";
export const TWITCH_TOKEN = "@bingolino:twitch-token";
export const TWITCH_USER_DATA = "@bingolino:twitch-user-data";

function setBingoExpiresCookie(cookieValue: string) {
  if (document.cookie.includes(BINGO_COOKIE_EXPIRES)) {
    const currentBingoExpiresValue =
      getCookie(BINGO_COOKIE_EXPIRES).split("=")[1];
    document.cookie.replace(currentBingoExpiresValue, cookieValue);
  } else {
    document.cookie = `${BINGO_COOKIE_EXPIRES}=${cookieValue};path=/`;
  }
}

export function setBingoCookie(cookieValue: string) {
  const today = new Date();
  const tomorrowStartDate = getTomorrowDate();

  let expires = `expires=${tomorrowStartDate.toUTCString()}`;
  const expiresCookie = getCookie(BINGO_COOKIE_EXPIRES);

  if (!!expiresCookie) {
    const expiresCookieDateValue = expiresCookie.split("=")[1];
    if (
      expiresCookieDateValue &&
      !(new Date(expiresCookieDateValue).getTime() > today.getTime())
    ) {
      expires = expiresCookie;
    } else {
      setBingoExpiresCookie(expires);
    }
  } else {
    setBingoExpiresCookie(expires);
  }

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
