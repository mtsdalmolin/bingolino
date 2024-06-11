"use client";
import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { createBingo, markStreamerSelectedItems } from "@/lib/bingo";
import {
  BINGO_COOKIE,
  getCookie,
  isBingoCookieSet,
  setBingoCookie,
} from "@/lib/cookie";
import MarkerPng from "@/public/assets/marker.png";
import { StreamerItemsFromApi } from "@/lib/api/types";

export function BingoCard({
  activeBingo,
  streamerItems,
  withWrapper = false,
}: {
  activeBingo: { id: number; dimensions: number; expiredAt: string };
  streamerItems: StreamerItemsFromApi[];
  withWrapper?: boolean;
}) {
  const [bingo, setBingo] = useState<ReturnType<typeof createBingo> | null>(
    null
  );

  const Wrapper = ({ children }: { children: ReactNode }) =>
    withWrapper ? (
      <div className="grid grid-rows-5 grid-flow-col gap-2">{children}</div>
    ) : (
      <>{children}</>
    );

  const markCard = (cardIndex: string) => {
    setBingo((prevState) => {
      const updatedBingo =
        prevState?.map((row, rowIdx) =>
          row.map((item, itemIdx) =>
            `${rowIdx}x${itemIdx}` === cardIndex
              ? { ...item, marked: !item.marked }
              : item
          )
        ) ?? null;

      setBingoCookie(JSON.stringify(updatedBingo), activeBingo.expiredAt);
      return updatedBingo;
    });
  };

  useEffect(() => {
    if (streamerItems && activeBingo) {
      if (isBingoCookieSet()) {
        const bingoFromCookie = JSON.parse(getCookie(BINGO_COOKIE));
        setBingo(
          markStreamerSelectedItems(
            bingoFromCookie,
            streamerItems,
            activeBingo.expiredAt
          )
        );
        return;
      }

      const todaysBingo = createBingo(
        activeBingo.dimensions,
        activeBingo.dimensions,
        streamerItems as []
      );
      setBingoCookie(JSON.stringify(todaysBingo), activeBingo.expiredAt);
      setBingo(todaysBingo);
    }
  }, [streamerItems, activeBingo]);

  return (
    <Wrapper>
      {bingo?.map((row, rowIdx) =>
        row.map((item, itemIdx) => (
          <div
            key={Math.random()}
            className="w-[8rem] max-h-[8rem] aspect-square bg-slate-50 border-1 text-black flex items-center justify-center p-2 text-center cursor-pointer hover:opacity-[0.95]"
            onClick={() => markCard(`${rowIdx}x${itemIdx}`)}
          >
            <p>{item.name}</p>
            {item.marked ? (
              <Image
                className="absolute"
                src={MarkerPng}
                width={65}
                height={65}
                alt="Marcador com a cara do Inoxville"
              />
            ) : null}
          </div>
        ))
      )}
    </Wrapper>
  );
}
