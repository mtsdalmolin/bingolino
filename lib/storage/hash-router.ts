"use client";

let hashRouterListeners: (() => void)[] = [];
const hashRouter: Record<string, string> = {};

function subscribe(callback: () => void) {
  hashRouterListeners.push(callback);
  return () => {
    hashRouterListeners = hashRouterListeners.filter(
      (listener) => listener !== callback
    );
  };
}

function getHashRouterSnapshot() {
  if (typeof window === "undefined") return {};

  window.location.hash
    ?.replace("#", "")
    .split("&")
    .forEach((item) => {
      const [key, value] = item.split("=");
      hashRouter[key] = value;
    });

  return hashRouter;
}

export const HashRouterExternalStore = {
  getHashRouterSnapshot,
  subscribe,
};
