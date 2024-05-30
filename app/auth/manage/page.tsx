"use client";

import { useState } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { getTwitchAuthLink } from "@/lib/twitch/auth";
import packageJson from "@/package.json";
import { ManageContent } from "@/components/bingo/manage/content";
import { ManageHeader } from "@/components/bingo/manage/header";
import { useTwitchUserDataContext } from "@/context/twitch-user-data";

import "./manage.css";

export type StreamerItemsFromApi = {
  id: number;
  name: string;
  marked: boolean | null;
};

const montserrat = Montserrat({ subsets: ["latin"] });

export default function TwitchExtensionManager() {
  const [currentBingo, setCurrentBingo] = useState<{
    bingoId: number;
    expiredAt: string;
  } | null>(null);

  const { twitchUserData } = useTwitchUserDataContext();

  return (
    <main className="flex flex-col items-center min-h-screen max-w-6xl mx-auto">
      {twitchUserData && twitchUserData.login ? (
        <>
          <ManageHeader
            fontFamily={montserrat.className}
            currentBingo={currentBingo}
          />
          <ManageContent setCurrentBingo={setCurrentBingo} />
        </>
      ) : (
        <>
          <header
            className={`${montserrat.className} flex items-center ${
              twitchUserData && twitchUserData.login ? "justify-between" : ""
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
