import {
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Montserrat } from "next/font/google";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActiveBingoId } from "@/lib/api/get-active-bingo";
import { postStreamerItem } from "@/lib/api/post-streamer-item";
import { patchBingoItem } from "@/lib/api/patch-bingo-item";
import { deleteStreamerItem } from "@/lib/api/delete-streamer-item";
import { StreamerItemsFromApi } from "@/app/auth/manage/page";
import { ConfirmationModal } from "@/components/modal/confirmation.client";
import { BingoItemsList } from "../items/list";
import { useTwitchUserDataContext } from "@/context/twitch-user-data";

const montserrat = Montserrat({ subsets: ["latin"] });

export function ManageContent({
  setCurrentBingo,
}: {
  setCurrentBingo: Dispatch<
    SetStateAction<{
      bingoId: number;
      expiredAt: string;
    } | null>
  >;
}) {
  const { twitchUserData } = useTwitchUserDataContext();

  const [selectedItem, setSelectedItem] = useState<StreamerItemsFromApi | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: activeBingo } = useQuery<{
    bingoId: number;
    expiredAt: string;
  }>({
    queryKey: ["getActiveBingoId"],
    queryFn: getActiveBingoId(twitchUserData.display_name),
    enabled: !!twitchUserData.display_name,
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

  const deleteStreamerItemMutation = useMutation({
    mutationFn: deleteStreamerItem(twitchUserData.display_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getStreamerItems"] });
      setSelectedItem(null);
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
    if (activeBingo?.bingoId)
      markitemMutation.mutate({
        itemId: item.id,
        marked: !item.marked,
        bingoId: activeBingo.bingoId,
      });
  };

  const handleDeleteItemClick = (item: StreamerItemsFromApi) => {
    deleteStreamerItemMutation.mutate({
      itemId: item.id,
    });
  };

  useEffect(() => {
    setCurrentBingo(activeBingo ?? null);
  }, [activeBingo, setCurrentBingo]);

  return (
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
      {!!selectedItem ? (
        <ConfirmationModal
          title={`Deletar ${selectedItem.name}`}
          description={`Você tem certeza que deseja deletar o item "${selectedItem.name}"? Essa alteração é irreversível!`}
          isLoading={deleteStreamerItemMutation.isPending}
          onConfirm={() => handleDeleteItemClick(selectedItem)}
          onCancel={() => setSelectedItem(null)}
        />
      ) : null}
    </>
  );
}
