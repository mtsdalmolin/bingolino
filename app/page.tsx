"use client";

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import packageJson from "../package.json";

import MarkerPng from "@/public/assets/marker.png";
import BibleThumpPng from "@/public/assets/biblethump.png";
import FacePalmPng from "@/public/assets/facepalm.png";
import { BingoCard } from "@/components/bingo/card";
import { getStreamerItems } from "@/lib/api/get-streamer-items";
import { getActiveBingoId } from "@/lib/api/get-active-bingo";

import { StreamerItemsFromApi } from "./auth/manage/page";

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
  } = useQuery<{ id: number; expiredAt: string }>({
    queryKey: ["getActiveBingoId"],
    queryFn: getActiveBingoId(streamerName ?? "Inoxville"),
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-24">
      <h1 className={`${montserrat.className} text-5xl`}>Bingolino</h1>
      {!isPending && !activeBingo ? (
        <>
          <Image
            src={BibleThumpPng}
            width={235}
            height={235}
            alt="Biblethump"
          />
          <p>Não há bingos ativos no momento!</p>
        </>
      ) : streamerItems && streamerItems.length < 25 ? (
        <>
          <Image src={FacePalmPng} width={500} height={500} alt="Facepalm" />
          <p>
            O streamer não cadastrou o número mínimo de itens para criarmos um
            bingo!
          </p>
        </>
      ) : isLoadingStreamerItems || isLoadingActiveBingo ? (
        <>
          <Image
            className="animate-spin"
            src={MarkerPng}
            width={235}
            height={235}
            alt="Marcador com a cara do Inoxville"
          />
          <p>Carregando itens do bingo...</p>
        </>
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
      <span className="absolute bottom-4">v{packageJson.version}</span>
    </main>
  );
}
