"use client";

import { getCookie, setCookie } from "../cookie";

export interface TwitchUserDataFromCookie {
  id: number;
  login: string;
  display_name: string;
  profile_image_url: string;
}

let cookiesListeners: (() => void)[] = [];

function getCookiesState(cookieName: string) {
  if (typeof document === "undefined") {
    return {};
  }

  const cookieValue = getCookie(cookieName);

  if (cookieValue[0] === "{") {
    return JSON.parse(cookieValue);
  }

  return cookieValue;
}

function setCookiesState(cookieName: string, cookieValue: unknown) {
  if (typeof cookieValue === "string") setCookie(cookieName, cookieValue);
  else setCookie(cookieName, JSON.stringify(cookieValue));
  emitCookiesChanges();
}

function emitCookiesChanges() {
  for (let listener of cookiesListeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  cookiesListeners = [...cookiesListeners, callback];
  return () => {
    cookiesListeners = cookiesListeners.filter(
      (listener) => listener !== callback
    );
  };
}

function getCookiesStateSnapshot(cookieName: string): () => any {
  if (typeof document === "undefined") {
    return () => {};
  }

  let cookieValue = getCookie(cookieName);

  if (cookieValue[0] === "{") {
    cookieValue = JSON.parse(cookieValue);
  }

  return () => cookieValue;
}

export const CookiesExternalStore = {
  getCookiesState,
  getCookiesStateSnapshot,
  subscribe,
  setCookiesState,
};
