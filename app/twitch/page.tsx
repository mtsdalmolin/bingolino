"use client";
import { useState } from "react";
import { Montserrat } from "next/font/google";
import { getStreamerItems } from "@/lib/api/get-streamer-items";
import { useQuery } from "@tanstack/react-query";
import { StreamerItemsFromApi } from "../auth/manage/page";
import { BingoCard } from "@/components/bingo/card";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function TwitchExtension() {
  const [openBingo, setOpenBingo] = useState(false);

  const { data: streamerItems, isLoading: isLoadingStreamerItems } = useQuery<
    StreamerItemsFromApi[]
  >({
    queryKey: ["getStreamerItems"],
    queryFn: getStreamerItems("Inoxville"),
  });

  return (
    <main className="flex items-center min-h-screen">
      {openBingo ? (
        <div className="relative grid grid-rows-5 grid-flow-col gap-2 p-4 bg-black">
          <button
            className={`${montserrat.className} absolute top-0 right-0 text-white bg-purple-900 px-1 aspect-square rounded-sm font-bold leading-3`}
            type="button"
            onClick={() => setOpenBingo(false)}
          >
            x
          </button>
          {streamerItems && <BingoCard streamerItems={streamerItems} />}
        </div>
      ) : (
        <button
          className={`${montserrat.className} py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold disabled:opacity-70 disabled:cursor-not-allowed`}
          type="button"
          onClick={() => setOpenBingo(true)}
          disabled={isLoadingStreamerItems}
        >
          Bingolino
        </button>
      )}
    </main>
  );
}
