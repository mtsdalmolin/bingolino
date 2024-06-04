"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { TWITCH_TOKEN, TWITCH_USER_DATA, setCookie } from "@/lib/cookie";
import {
  CookiesExternalStore,
  TwitchUserDataFromCookie,
} from "@/lib/storage/cookie";
import { useQuery } from "@tanstack/react-query";
import { getTwitchUserData } from "@/lib/twitch/api/get-user-data";
import { HashRouterExternalStore } from "@/lib/storage/hash-router";

const twitchUserInitialData = {
  id: 0,
  display_name: "",
  login: "",
  profile_image_url: "",
};

const TwitchUserDataContext = createContext<{
  twitchUserData: TwitchUserDataFromCookie;
}>({
  twitchUserData: twitchUserInitialData,
});

export function TwitchUserDataContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [_, forceRefresh] = useState(null);
  const twitchUserDataFromCookie = useSyncExternalStore<
    TwitchUserDataFromCookie | ""
  >(
    CookiesExternalStore.subscribe,
    CookiesExternalStore.getCookiesStateSnapshot(TWITCH_USER_DATA),
    CookiesExternalStore.getCookiesStateSnapshot(TWITCH_USER_DATA)
  );

  const twitchTokenFromCookie = useSyncExternalStore<string>(
    CookiesExternalStore.subscribe,
    CookiesExternalStore.getCookiesStateSnapshot(TWITCH_TOKEN),
    CookiesExternalStore.getCookiesStateSnapshot(TWITCH_TOKEN)
  );

  const hashRouter = useSyncExternalStore(
    HashRouterExternalStore.subscribe,
    HashRouterExternalStore.getHashRouterSnapshot,
    HashRouterExternalStore.getHashRouterSnapshot
  );

  const { data: twitchUserDataFromApi } = useQuery({
    queryKey: ["getTwitchUserData"],
    queryFn: () =>
      getTwitchUserData(
        hashRouter.access_token ?? twitchTokenFromCookie,
        hashRouter.token_type ?? "bearer"
      ),
    enabled:
      !twitchUserDataFromCookie &&
      !!(hashRouter.access_token || twitchTokenFromCookie),
  });

  useEffect(() => {
    if (
      twitchUserDataFromApi &&
      "login" in twitchUserDataFromApi &&
      !twitchUserDataFromCookie
    ) {
      CookiesExternalStore.setCookiesState(
        TWITCH_USER_DATA,
        twitchUserDataFromApi
      );
      CookiesExternalStore.setCookiesState(
        TWITCH_TOKEN,
        hashRouter.access_token
      );
      forceRefresh(null);
    }
  }, [
    hashRouter.access_token,
    twitchUserDataFromApi,
    twitchUserDataFromCookie,
  ]);

  return (
    <TwitchUserDataContext.Provider
      value={{
        twitchUserData:
          twitchUserDataFromCookie === ""
            ? twitchUserInitialData
            : twitchUserDataFromCookie,
      }}
    >
      {children}
    </TwitchUserDataContext.Provider>
  );
}

export const useTwitchUserDataContext = () => {
  return useContext(TwitchUserDataContext);
};
