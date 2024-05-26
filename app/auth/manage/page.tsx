"use client";
import { KeyboardEvent, useRef, useState } from "react";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { getStreamerItems } from "@/lib/api/get-streamer-items";
import { getTwitchAuthLink } from "@/lib/twitch/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import packageJson from "@/package.json";
import { postStreamerItem } from "@/lib/api/post-streamer-item";
import { patchBingoItem } from "@/lib/api/patch-bingo-item";
import { getActiveBingoId } from "@/lib/api/get-active-bingo";
import "./manage.css";
import { deleteStreamerItem } from "@/lib/api/delete-streamer-item";
import { ConfirmationModal } from "@/components/modal/confirmation.client";

type StreamerItemsFromApi = {
  id: number;
  name: string;
  marked: boolean | null;
};

const montserrat = Montserrat({ subsets: ["latin"] });

export default function TwitchExtensionManager() {
  const [selectedItem, setSelectedItem] = useState<StreamerItemsFromApi | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: streamerItems, isLoading } = useQuery<StreamerItemsFromApi[]>({
    queryKey: ["getStreamerItems"],
    queryFn: getStreamerItems,
  });

  const { data: bingoId } = useQuery<number>({
    queryKey: ["getActiveBingoId"],
    queryFn: getActiveBingoId,
  });

  const createBingoItemMutation = useMutation({
    mutationFn: postStreamerItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStreamerItems"] });
      if (inputRef.current) inputRef.current.value = "";
    },
  });

  const markitemMutation = useMutation({
    mutationFn: patchBingoItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStreamerItems"] });
    },
  });

  const hasMutationPending =
    createBingoItemMutation.isPending || markitemMutation.isPending;

  const deleteStreamerItemMutation = useMutation({
    mutationFn: deleteStreamerItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStreamerItems"] });
    },
  });

  const handleKeyUp = (evt: KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      createBingoItemMutation.mutate({
        itemName: evt.currentTarget.value,
        streamer: "inoxville",
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

  return (
    <main
      className={`flex flex-col items-center min-h-screen ${
        hasMutationPending ? "cursor-progress" : ""
      }`}
    >
      <header
        className={`${montserrat.className} flex items-center justify-between w-full px-8 py-4`}
      >
        <Link href="/">
          <h1 className={`${montserrat.className} text-white text-2xl`}>
            Bingolino
          </h1>
        </Link>
        <Link
          className={`${montserrat.className} py-2 px-3 text-white bg-purple-900 rounded-md h-auto font-semibold`}
          href={getTwitchAuthLink()}
        >
          Entrar com a Twitch
        </Link>
      </header>
      <div className="max-w-full p-8 bg-gray-800 rounded-lg shadow-lg w-96 text-gray-200">
        <div className="flex items-center mb-6">
          <h2 className={`${montserrat.className} ml-3 text-lg`}>
            Itens do bingo
          </h2>
        </div>
        <button className="flex items-center w-full h-8 px-2 mt-2 text-sm font-medium rounded">
          <svg
            className="w-5 h-5 text-gray-400 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
        {isLoading ? (
          <div className="w-full text-center">Carregando...</div>
        ) : null}
        {streamerItems?.map((item) => (
          <div key={item.id}>
            <input
              className="hidden"
              type="checkbox"
              id="task_6"
              checked={!!item.marked}
            />
            <label
              className={`flex items-center h-10 px-2 rounded hover:bg-gray-900 ${
                markitemMutation &&
                markitemMutation.variables &&
                typeof markitemMutation.variables === "object" &&
                "itemId" in markitemMutation.variables &&
                markitemMutation.variables.itemId === item.id &&
                markitemMutation.isPending
                  ? "opacity-60 cursor-progress"
                  : ""
              }`}
              htmlFor="task_6"
            >
              <span
                className="flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-500 rounded-full cursor-pointer"
                onClick={() => handleMarkItemClick(item)}
              >
                <svg
                  className="w-4 h-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              <span className="ml-4 text-sm">{item.name}</span>
              <button
                className="ml-auto"
                onClick={() => setSelectedItem(item)}
                title="Excluir item"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1"
                  stroke="#ff2050"
                  className="size-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </label>
          </div>
        ))}
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
    </main>
  );
}
