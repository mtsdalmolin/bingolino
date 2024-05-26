"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import MarkerPng from "@/public/assets/marker.png";
import { createBingo, markStreamerSelectedItems } from "@/lib/bingo";
import {
  getCookie,
  isBingoCookieSet,
  setBingoCookie,
  BINGO_COOKIE_NAME,
} from "@/lib/cookie";
import { getBingoItems } from "@/lib/api/get-bingo-items";
import { getStreamerItems } from "@/lib/api/get-streamer-items";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function TwitchExtension() {
  const [bingo, setBingo] = useState<ReturnType<typeof createBingo> | null>(
    null
  );
  const [openBingo, setOpenBingo] = useState(false);
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
    <main className="flex items-center min-h-screen">
      {loading ? "Carregando..." : null}
      {openBingo ? (
        <div className="relative grid grid-rows-5 grid-flow-col gap-2 p-4 bg-black">
          <button
            className={`${montserrat.className} absolute top-0 right-0 text-white bg-purple-900 px-1 aspect-square rounded-sm font-bold leading-3`}
            type="button"
            onClick={() => setOpenBingo(false)}
          >
            x
          </button>
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
      ) : (
        <button
          className={`${montserrat.className} py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold`}
          type="button"
          onClick={() => setOpenBingo(true)}
        >
          Bingolino
        </button>
      )}
    </main>
  );
}
