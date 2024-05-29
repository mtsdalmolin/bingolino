"use client";
import { useState } from "react";
import { Montserrat } from "next/font/google";
import { getStreamerItems } from "@/lib/api/get-streamer-items";
import { useQuery } from "@tanstack/react-query";
import { StreamerItemsFromApi } from "../auth/manage/page";
import { BingoCard } from "@/components/bingo/card";
import { getActiveBingo } from "@/lib/api/get-active-bingo";
import { NoActiveBingo } from "@/components/bingo/states/no-active-bingo";
import { NotEnoughItems } from "@/components/bingo/states/not-enough-items";
import { LoadingBingo } from "@/components/bingo/states/loading-bingo";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function TwitchExtension() {
  const [openBingo, setOpenBingo] = useState(false);

  const { data: activeBingo, isLoading: isLoadingActiveBingo } = useQuery({
    queryKey: ["getActiveBingo"],
    queryFn: getActiveBingo("Inoxville"),
  });

  const {
    data: streamerItems,
    isLoading: isLoadingStreamerItems,
    isPending,
  } = useQuery<StreamerItemsFromApi[]>({
    queryKey: ["getStreamerItems"],
    queryFn: getStreamerItems("Inoxville"),
  });

  return (
    <main className="flex items-center min-h-screen text-white">
      {openBingo ? (
        <div className="relative grid grid-rows-5 grid-flow-col gap-2 p-4 bg-black">
          <button
            className={`${montserrat.className} absolute top-0 right-0 text-white bg-purple-900 px-1 aspect-square rounded-sm font-bold leading-3`}
            type="button"
            onClick={() => setOpenBingo(false)}
          >
            x
          </button>
          {!isPending && !activeBingo ? (
            <NoActiveBingo />
          ) : streamerItems && streamerItems.length < 25 ? (
            <NotEnoughItems />
          ) : isLoadingStreamerItems || isLoadingActiveBingo ? (
            <LoadingBingo />
          ) : (
            streamerItems &&
            activeBingo && (
              <BingoCard
                activeBingo={activeBingo}
                streamerItems={streamerItems}
                withWrapper
              />
            )
          )}
        </div>
      ) : (
        <button
          className={`${montserrat.className} py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold disabled:opacity-70 disabled:cursor-not-allowed`}
          type="button"
          onClick={() => setOpenBingo(true)}
          disabled={isLoadingStreamerItems || isLoadingActiveBingo}
        >
          Bingolino
        </button>
      )}
    </main>
  );
}
