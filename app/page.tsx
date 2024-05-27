"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import packageJson from "../package.json";

import { Montserrat } from "next/font/google";
import { getStreamerItems } from "@/lib/api/get-streamer-items";
import { StreamerItemsFromApi } from "./auth/manage/page";
import { BingoCard } from "@/components/bingo/card";
import MarkerPng from "@/public/assets/marker.png";
import BibleThumpPng from "@/public/assets/biblethump.png";
import { getActiveBingoId } from "@/lib/api/get-active-bingo";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function Home() {
  const { data: streamerItems, isLoading: isLoadingStreamerItems } = useQuery<
    StreamerItemsFromApi[]
  >({
    queryKey: ["getStreamerItems"],
    queryFn: getStreamerItems("inoxville"),
  });

  const {
    data: activeBingoId,
    isLoading: isLoadingActiveBingoId,
    isPending,
  } = useQuery<StreamerItemsFromApi[]>({
    queryKey: ["getActiveBingoId"],
    queryFn: getActiveBingoId("inoxville"),
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-24">
      <h1 className={`${montserrat.className} text-5xl`}>Bingolino</h1>
      {!isPending && !activeBingoId ? (
        <>
          <Image
            src={BibleThumpPng}
            width={235}
            height={235}
            alt="Marcador com a cara do Inoxville"
          />
          <p>Não há bingos ativos no momento!</p>
        </>
      ) : isLoadingStreamerItems || isLoadingActiveBingoId ? (
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
        streamerItems && <BingoCard streamerItems={streamerItems} withWrapper />
      )}
      <span className="absolute bottom-4">v{packageJson.version}</span>
    </main>
  );
}
