"use client";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { getTwitchAuthLink } from "@/lib/twitch/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import packageJson from "@/package.json";
import { postStreamerItem } from "@/lib/api/post-streamer-item";
import { patchBingoItem } from "@/lib/api/patch-bingo-item";
import { getActiveBingoId } from "@/lib/api/get-active-bingo";
import "./manage.css";
import { deleteStreamerItem } from "@/lib/api/delete-streamer-item";
import { ConfirmationModal } from "@/components/modal/confirmation.client";
import {
  TWITCH_TOKEN,
  TWITCH_USER_DATA,
  getCookie,
  setCookie,
} from "@/lib/cookie";
import { getTwitchUserData } from "@/lib/twitch/api/get-user-data";
import Image from "next/image";
import { BingoItemsList } from "@/components/bingo/items/list";

export type StreamerItemsFromApi = {
  id: number;
  name: string;
  marked: boolean | null;
};

const montserrat = Montserrat({ subsets: ["latin"] });

const hashRouter: Record<string, string> = {};

if (typeof window === "object") {
  window.location.hash
    ?.replace("#", "")
    .split("&")
    .forEach((item) => {
      const [key, value] = item.split("=");
      hashRouter[key] = value;
    });
}

export default function TwitchExtensionManager() {
  const [selectedItem, setSelectedItem] = useState<StreamerItemsFromApi | null>(
    null
  );
  const [twitchUserData, setTwitchUserData] = useState(
    JSON.parse(getCookie(TWITCH_USER_DATA))
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: bingoId } = useQuery<number>({
    queryKey: ["getActiveBingoId"],
    queryFn: getActiveBingoId(twitchUserData.display_name),
  });

  const { data: twitchUserDataFromApi } = useQuery({
    queryKey: ["getTwitchUserData"],
    queryFn: () =>
      getTwitchUserData(
        `Bearer ${hashRouter.access_token ?? getCookie(TWITCH_TOKEN) ?? ""}`
      ),
  });

  const createBingoItemMutation = useMutation({
    mutationFn: postStreamerItem(twitchUserData.display_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStreamerItems"] });
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  const markitemMutation = useMutation({
    mutationFn: patchBingoItem(twitchUserData.display_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStreamerItems"] });
    },
  });

  const hasMutationPending =
    createBingoItemMutation.isPending || markitemMutation.isPending;

  const deleteStreamerItemMutation = useMutation({
    mutationFn: deleteStreamerItem(twitchUserData.display_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStreamerItems"] });
    },
  });

  const submitNewItem = ({
    itemName,
    streamer,
  }: {
    itemName: string;
    streamer: string;
  }) => {
    createBingoItemMutation.mutate({
      itemName,
      streamer,
    });
  };

  const handleKeyUp = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      submitNewItem({
        itemName: evt.currentTarget.value,
        streamer: twitchUserData.display_name,
      });
    }
  };

  const handleMarkItemClick = (item: StreamerItemsFromApi) => {
    markitemMutation.mutate({
      itemId: item.id,
      marked: !item.marked,
      bingoId,
    });
  };

  const handleDeleteItemClick = (item: StreamerItemsFromApi) => {
    deleteStreamerItemMutation.mutate({
      itemId: item.id,
    });
    setSelectedItem(null);
  };

  useEffect(() => {
    if (twitchUserDataFromApi && twitchUserDataFromApi.status === 401) {
      setTwitchUserData(null);
    }

    if (twitchUserDataFromApi) {
      if (!getCookie(TWITCH_USER_DATA))
        setCookie(
          TWITCH_USER_DATA,
          JSON.stringify(twitchUserDataFromApi.data[0])
        );
      if (!getCookie(TWITCH_TOKEN))
        setCookie(TWITCH_TOKEN, hashRouter.access_token);

      if (
        "data" in twitchUserDataFromApi &&
        Array.isArray(twitchUserDataFromApi.data)
      )
        setTwitchUserData(twitchUserDataFromApi.data[0]);
    }
  }, [twitchUserDataFromApi]);

  return (
    <main
      className={`flex flex-col items-center min-h-screen ${
        hasMutationPending ? "cursor-progress" : ""
      }`}
    >
      <header
        className={`${montserrat.className} flex items-center ${
          !!twitchUserData ? "justify-between" : ""
        } w-full px-8 py-4`}
      >
        <Link href="/">
          <h1 className={`${montserrat.className} text-white text-2xl`}>
            Bingolino
          </h1>
        </Link>
        {!!twitchUserData ? (
          <Link
            className={`${montserrat.className} py-2 px-3 h-auto font-semibold`}
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
        ) : null}
      </header>
      {!!twitchUserData ? (
        <>
          <div className="max-w-full p-8 bg-gray-800 rounded-lg shadow-lg w-96 text-gray-200">
            <div className="flex items-center mb-6">
              <h2 className={`${montserrat.className} ml-3 text-lg`}>
                Itens do bingo
              </h2>
            </div>
            <button className="flex items-center w-full px-2 pt-2 pb-4 text-sm font-medium rounded">
              <svg
                className="w-5 h-5 text-gray-400 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => {
                  if (inputRef.current?.value)
                    submitNewItem({
                      itemName: inputRef.current.value,
                      streamer: twitchUserData.display_name,
                    });
                  else inputRef.current?.focus();
                }}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <input
                ref={inputRef}
                className="flex-grow h-8 ml-4 bg-transparent focus:outline-none font-medium"
                type="text"
                placeholder="adicionar novo item"
                onKeyUp={handleKeyUp}
              />
            </button>
            <BingoItemsList
              twitchUserData={twitchUserData}
              onDeleteItem={setSelectedItem}
              onMarkItem={handleMarkItemClick}
              isLoading={
                !!(
                  markitemMutation &&
                  markitemMutation.variables &&
                  typeof markitemMutation.variables === "object" &&
                  "itemId" in markitemMutation.variables &&
                  markitemMutation.isPending
                )
              }
            />
          </div>
          <footer>v{packageJson.version}</footer>
          {!!selectedItem ? (
            <ConfirmationModal
              title={`Deletar ${selectedItem.name}`}
              description={`Você tem certeza que deseja deletar o item "${selectedItem.name}"? Essa alteração é irreversível!`}
              onConfirm={() => handleDeleteItemClick(selectedItem)}
              onCancel={() => setSelectedItem(null)}
            />
          ) : null}
        </>
      ) : (
        <Link
          className={`${montserrat.className} py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold`}
          href={getTwitchAuthLink()}
        >
          Entrar com a Twitch
        </Link>
      )}
    </main>
  );
}
