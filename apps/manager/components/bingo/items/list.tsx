import { Dispatch, SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStreamerItems } from "@/lib/api/get-streamer-items";
import { StreamerItemsFromApi } from "@/lib/api/types";

export function BingoItemsList({
  twitchUserData,
  isLoading,
  onDeleteItem,
  onMarkItem,
}: {
  twitchUserData: any;
  isLoading: boolean;
  onDeleteItem: Dispatch<SetStateAction<StreamerItemsFromApi | null>>;
  onMarkItem: (item: StreamerItemsFromApi) => void;
}) {
  const { data: streamerItems, isLoading: isLoadingStreamerItems } = useQuery<
    StreamerItemsFromApi[]
  >({
    queryKey: ["getStreamerItems"],
    queryFn: getStreamerItems(twitchUserData.display_name),
  });

  return (
    <>
      {isLoadingStreamerItems ? (
        <div className="w-full text-center">Carregando itens do bingo...</div>
      ) : null}
      {streamerItems?.length === 0 ? (
        <p className="text-center text-sm text-gray-300">
          Sua lista de itens no bingo está vazia! Cadastre itens no campo acima.
        </p>
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
              isLoading ? "opacity-60 cursor-progress" : ""
            }`}
            htmlFor="task_6"
          >
            <span
              className={`flex items-center justify-center w-5 h-5 text-transparent border-2 border-gray-500 rounded-full ${
                isLoading ? "cursor-progress" : "cursor-pointer"
              }`}
              onClick={() => onMarkItem(item)}
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
            <span
              className="px-4 text-sm text-ellipsis overflow-hidden whitespace-nowrap"
              title={item.name}
            >
              {item.name}
            </span>
            <button
              className="ml-auto"
              onClick={() => onDeleteItem(item)}
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
    </>
  );
}
