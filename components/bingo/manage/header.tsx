"use client";

import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { postBingo } from "@/lib/api/post-bingo";

export function ManageHeader({
  fontFamily,
  twitchUserData,
  currentBingo,
}: {
  fontFamily: string;
  twitchUserData: any;
  currentBingo: {
    bingoId: number;
    expiredAt: string;
  } | null;
}) {
  const createBingoMutation = useMutation({
    mutationFn: postBingo(twitchUserData.display_name),
  });

  const handleCreateBingoClick = () => {
    createBingoMutation.mutate();
  };

  return (
    <header
      className={`${fontFamily} flex items-center justify-between w-full px-8 py-4`}
    >
      <Link href="/">
        <h1 className={`${fontFamily} text-white text-2xl`}>Bingolino</h1>
      </Link>
      {currentBingo?.expiredAt ? (
        <h3>
          Bingo expira em{" "}
          {new Date(currentBingo?.expiredAt).toLocaleTimeString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
      ) : (
        <button
          className="py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold"
          onClick={handleCreateBingoClick}
        >
          {createBingoMutation.isPending ? "Criando..." : "Criar bingo"}
        </button>
      )}
      <Link
        className={`${fontFamily} py-2 px-3 h-auto font-semibold`}
        href={`https://twitch.tv/${twitchUserData.display_name}`}
        target="_blank"
      >
        <Image
          className="inline-block h-10 w-10 rounded-full ring-2 ring-purple-900"
          src={twitchUserData.profile_image_url}
          alt={twitchUserData.display_name}
          width={45}
          height={45}
        />
      </Link>
    </header>
  );
}
