import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/lib/drizzle/db";
import {
  selectedBingoItems,
  bingos,
  streamerBingosItems,
} from "@/lib/drizzle/schema";

type Context = {
  params: {
    [key: string]: string;
  };
};

export async function GET(_: NextRequest, context: Context) {
  const streamerName = context.params["streamer-name"];
  const bingo = await db
    .select({
      bingoId: bingos.id,
      itemId: streamerBingosItems.id,
      itemName: streamerBingosItems.name,
    })
    .from(bingos)
    .innerJoin(selectedBingoItems, eq(bingos.id, selectedBingoItems.bingoId))
    .innerJoin(
      streamerBingosItems,
      eq(selectedBingoItems.bingoItemId, streamerBingosItems.id)
    )
    .where(
      and(
        gt(bingos.expiredAt, new Date()),
        eq(bingos.streamer, streamerName),
        eq(selectedBingoItems.marked, true)
      )
    )
    .orderBy(desc(bingos.id));

  return NextResponse.json(bingo, { status: 200 });
}

export async function POST(_: NextRequest, context: Context) {
  const streamerName = context.params["streamer-name"];

  if (!streamerName || streamerName === "undefined") {
    return NextResponse.json(
      { message: "Streamer name not well formatted" },
      { status: 422 }
    );
  }

  try {
    await db.insert(bingos).values({ streamer: streamerName });
    return NextResponse.json({}, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(err.detail, { status: 422 });
  }
}
