"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postBingo } from "@/lib/api/post-bingo";
import { useTwitchUserDataContext } from "@/context/twitch-user-data";
import { BingoSetupModal } from "@/components/modal/bingo-setup.client";
import { ToastFeedbackSuccess } from "@/components/feedback/toast-success";
import { ToastFeedbackError } from "@/components/feedback/toast-error";

export function ManageHeader({
  fontFamily,
  currentBingo,
}: {
  fontFamily: string;
  currentBingo: {
    bingoId: number;
    expiredAt: string;
  } | null;
}) {
  const { twitchUserData } = useTwitchUserDataContext();
  const queryClient = useQueryClient();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const createBingoMutation = useMutation({
    mutationFn: postBingo(twitchUserData.display_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getActiveBingo"] });
      setFeedbackOpen(true);
      setCreateModalOpen(false);
    },
    onError: () => {
      setFeedbackOpen(true);
      setCreateModalOpen(false);
    },
  });

  const handleCreateBingoClick = (dimensions: number) => {
    createBingoMutation.mutate(dimensions);
  };

  const onClose = () => {
    setFeedbackOpen(false);
  };

  return (
    <>
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
            onClick={() => setCreateModalOpen(true)}
          >
            Criar bingo
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
      {createModalOpen ? (
        <BingoSetupModal
          idLoading={createBingoMutation.isPending}
          onCancel={() => setCreateModalOpen(false)}
          onSubmit={handleCreateBingoClick}
        />
      ) : null}
      {feedbackOpen && createBingoMutation.isSuccess ? (
        <ToastFeedbackSuccess
          message="Bingo criado com sucesso!"
          onClose={onClose}
        />
      ) : null}
      {feedbackOpen && createBingoMutation.isError ? (
        <ToastFeedbackError
          message="Ocorreu um erro inesperado!"
          onClose={onClose}
        />
      ) : null}
    </>
  );
}
