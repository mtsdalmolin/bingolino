"use client";

import { Montserrat } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import packageJson from "../package.json";

import { getStreamerItems } from "@/lib/api/get-streamer-items";
import { getActiveBingo } from "@/lib/api/get-active-bingo";
import { StreamerItemsFromApi } from "@/lib/api/types";

import { BingoCard } from "@/components/bingo/card";
import { LoadingBingo } from "@/components/bingo/states/loading-bingo";
import { NotEnoughItems } from "@/components/bingo/states/not-enough-items";
import { NoActiveBingo } from "@/components/bingo/states/no-active-bingo";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  const searchParams = useSearchParams();
  const streamerName = searchParams.get("streamer");

  const { data: streamerItems, isLoading: isLoadingStreamerItems } = useQuery<
    StreamerItemsFromApi[]
  >({
    queryKey: ["getStreamerItems"],
    queryFn: getStreamerItems(streamerName ?? "Inoxville"),
  });

  const {
    data: activeBingo,
    isLoading: isLoadingActiveBingo,
    isPending,
  } = useQuery<{ id: number; dimensions: number; expiredAt: string }>({
    queryKey: ["getActiveBingo"],
    queryFn: getActiveBingo(streamerName ?? "Inoxville"),
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-24">
      <h1 className={`${montserrat.className} text-5xl`}>Bingolino</h1>
      <section className="flex-1 flex items-center">
        {!isPending && !activeBingo ? (
          <NoActiveBingo />
        ) : streamerItems &&
          activeBingo?.dimensions &&
          streamerItems.length < activeBingo.dimensions ** 2 ? (
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
      </section>
      <span className="absolute bottom-4">v{packageJson.version}</span>
    </main>
  );
}
