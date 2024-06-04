"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BingoCard } from "bingolino/components/bingo/card";
import { NoActiveBingo } from "bingolino/components/bingo/states/no-active-bingo";
import { NotEnoughItems } from "bingolino/components/bingo/states/not-enough-items";
import { LoadingBingo } from "bingolino/components/bingo/states/loading-bingo";
import { type StreamerItemsFromApi } from "bingolino/lib/api/types";
import { getStreamerItems } from "../api/get-streamer-items";
import { getActiveBingo } from "../api/get-active-bingo";

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
        <div className="relative flex flex-col items-center gap-2 p-4 bg-black">
          <button
            className="absolute top-0 right-0 text-white bg-purple-900 px-1 aspect-square rounded-sm font-bold leading-3"
            type="button"
            onClick={() => setOpenBingo(false)}
          >
            x
          </button>
          {!isPending && !activeBingo ? (
            <div className="flex flex-col items-center p-32">
              <NoActiveBingo />
            </div>
          ) : streamerItems && streamerItems.length < 25 ? (
            <div className="flex flex-col items-center p-32">
              <NotEnoughItems />
            </div>
          ) : isLoadingStreamerItems || isLoadingActiveBingo ? (
            <div className="flex flex-col items-center p-32">
              <LoadingBingo />
            </div>
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
          className="py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
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
