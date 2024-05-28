"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { getTwitchAuthLink } from "@/lib/twitch/auth";
import { useQuery } from "@tanstack/react-query";
import packageJson from "@/package.json";
import {
  TWITCH_TOKEN,
  TWITCH_USER_DATA,
  getCookie,
  setCookie,
} from "@/lib/cookie";
import { getTwitchUserData } from "@/lib/twitch/api/get-user-data";
import { ManageContent } from "@/components/bingo/manage/content";
import { ManageHeader } from "@/components/bingo/manage/header";

import "./manage.css";

export type StreamerItemsFromApi = {
  id: number;
  name: string;
  marked: boolean | null;
};

const montserrat = Montserrat({ subsets: ["latin"] });

const hashRouter: Record<string, string> = {};

if (typeof window === "object") {
  window.location.hash
    ?.replace("#", "")
    .split("&")
    .forEach((item) => {
      const [key, value] = item.split("=");
      hashRouter[key] = value;
    });
}

export default function TwitchExtensionManager() {
  const [twitchUserData, setTwitchUserData] = useState(null);
  const [currentBingo, setCurrentBingo] = useState<{
    bingoId: number;
    expiredAt: string;
  } | null>(null);

  const { data: twitchUserDataFromApi } = useQuery({
    queryKey: ["getTwitchUserData"],
    queryFn: () =>
      getTwitchUserData(hashRouter.access_token, hashRouter.token_type),
  });

  useEffect(() => {
    if (twitchUserDataFromApi && twitchUserDataFromApi.message) {
      setTwitchUserData(null);
    }

    if (twitchUserDataFromApi && "login" in twitchUserDataFromApi) {
      if (!getCookie(TWITCH_USER_DATA))
        setCookie(TWITCH_USER_DATA, JSON.stringify(twitchUserDataFromApi));
      if (!getCookie(TWITCH_TOKEN) && hashRouter.access_token)
        setCookie(TWITCH_TOKEN, hashRouter.access_token);

      if (twitchUserDataFromApi) setTwitchUserData(twitchUserDataFromApi);
    }
  }, [twitchUserDataFromApi]);

  return (
    <main className="flex flex-col items-center min-h-screen max-w-6xl mx-auto">
      {twitchUserData && !("message" in twitchUserData) ? (
        <>
          <ManageHeader
            fontFamily={montserrat.className}
            twitchUserData={twitchUserData}
            currentBingo={currentBingo}
          />
          <ManageContent
            twitchUserData={twitchUserData}
            setCurrentBingo={setCurrentBingo}
          />
        </>
      ) : (
        <>
          <header
            className={`${montserrat.className} flex items-center ${
              twitchUserData ? "justify-between" : ""
            } w-full px-8 py-4`}
          >
            <Link href="/">
              <h1 className={`${montserrat.className} text-white text-2xl`}>
                Bingolino
              </h1>
            </Link>
          </header>

          <Link
            className={`${montserrat.className} py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold`}
            href={getTwitchAuthLink()}
          >
            Entrar com a Twitch
          </Link>
        </>
      )}
      <footer className="mt-auto py-4">v{packageJson.version}</footer>
    </main>
  );
}
