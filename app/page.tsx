"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import MarkerPng from "../public/assets/marker.png";
import packageJson from "../package.json";

import { Montserrat } from "next/font/google";
import {
  getCookie,
  isBingoCookieSet,
  setBingoCookie,
  BINGO_COOKIE_NAME,
} from "../lib/cookie";
import { createBingo, markStreamerSelectedItems } from "@/lib/bingo";
import { getBingoItems } from "@/lib/api/get-bingo-items";
import { getStreamerItems } from "@/lib/api/get-streamer-items";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  const [bingo, setBingo] = useState<ReturnType<typeof createBingo> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const markCard = (cardIndex: string) => {
    setBingo((prevState) => {
      const updatedBingo =
        prevState?.map((row, rowIdx) =>
          row.map((item, itemIdx) =>
            `${rowIdx}x${itemIdx}` === cardIndex
              ? { ...item, marked: !item.marked }
              : item
          )
        ) ?? null;

      setBingoCookie(JSON.stringify(updatedBingo));
      return updatedBingo;
    });
  };

  useEffect(() => {
    setLoading(true);
    getBingoItems().then((markedOptions: unknown) => {
      if (isBingoCookieSet()) {
        const bingoFromCookie = JSON.parse(getCookie(BINGO_COOKIE_NAME));
        setBingo(markStreamerSelectedItems(bingoFromCookie, markedOptions));
        setLoading(false);
        return;
      }
      getStreamerItems().then((streamerItems) => {
        const todaysBingo = createBingo(5, 5, streamerItems);
        setBingoCookie(JSON.stringify(todaysBingo));
        setBingo(todaysBingo);
        setLoading(false);
      });
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className={`${montserrat.className} text-5xl`}>Bingolino</h1>
      <div className="grid grid-rows-5 grid-flow-col gap-2">
        {loading ? "Carregando..." : null}
        {bingo?.map((row, rowIdx) =>
          row.map((item, itemIdx) => (
            <div
              key={Math.random()}
              className="w-[8rem] max-h-[8rem] aspect-square bg-slate-50 border-1 text-black flex items-center justify-center p-2 text-center cursor-pointer hover:opacity-[0.95]"
              onClick={() => markCard(`${rowIdx}x${itemIdx}`)}
            >
              <p>{item.text}</p>
              {item.marked ? (
                <Image
                  className="absolute"
                  src={MarkerPng}
                  width={65}
                  height={65}
                  alt="Marcador com a cara do Inoxville"
                />
              ) : null}
            </div>
          ))
        )}
      </div>
      <span className="absolute bottom-4">v{packageJson.version}</span>
    </main>
  );
}
