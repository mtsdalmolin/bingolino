import { NextRequest, NextResponse } from "next/server";
import { desc, eq, sql } from "drizzle-orm";
import {
  bingos,
  selectedBingoItems,
  streamerBingosItems,
} from "@/lib/drizzle/schema";
import { db } from "@/lib/drizzle/db";

type Context = {
  params: {
    [key: string]: string;
  };
};

export async function GET(_: NextRequest, context: Context) {
  const streamerName = context.params["streamer-name"];

  if (!streamerName || streamerName === "undefined") {
    return NextResponse.json(
      { message: "Streamer name not well formatted" },
      { status: 422 }
    );
  }

  const latestBingo = await db
    .select({ id: bingos.id })
    .from(bingos)
    .where(eq(bingos.streamer, streamerName))
    .orderBy(desc(bingos.id))
    .limit(1);

  const selectedBingoItemsByBingoId = db
    .select()
    .from(selectedBingoItems)
    .where(eq(selectedBingoItems.bingoId, latestBingo[0].id))
    .as("sbtbbid");

  const streamerItemsSubQuery = db
    .select({
      id: streamerBingosItems.id,
      name: streamerBingosItems.name,
      marked: selectedBingoItemsByBingoId.marked,
    })
    .from(streamerBingosItems)
    .leftJoin(
      selectedBingoItemsByBingoId,
      eq(selectedBingoItemsByBingoId.bingoItemId, streamerBingosItems.id)
    )
    .where(eq(streamerBingosItems.streamer, streamerName))
    .as("sq");

  const streamerItemsSorted = await db
    .select()
    .from(streamerItemsSubQuery)
    .orderBy(sql`REPLACE("sq"."name", '"', '')`);

  return NextResponse.json(streamerItemsSorted, { status: 200 });
}

export async function POST(request: NextRequest, context: Context) {
  const streamerName = context.params["streamer-name"];
  const requestBody = await request.json();
  const { itemName } = requestBody;

  if (!streamerName || streamerName === "undefined") {
    return NextResponse.json(
      { message: "Streamer name not well formatted" },
      { status: 422 }
    );
  }

  if (!itemName || itemName === "undefined") {
    return NextResponse.json(
      { message: "Body not well formatted" },
      { status: 422 }
    );
  }

  try {
    await db
      .insert(streamerBingosItems)
      .values({ name: itemName, streamer: streamerName });
    return NextResponse.json({}, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(err.detail, { status: 422 });
  }
}

export async function PATCH(request: NextRequest) {
  const requestBody = await request.json();
  const { bingoId, itemId, marked } = requestBody;

  if (
    !bingoId ||
    bingoId === "undefined" ||
    !itemId ||
    itemId === "undefined"
  ) {
    return NextResponse.json(
      { message: "Body not well formatted" },
      { status: 422 }
    );
  }

  try {
    await db
      .insert(selectedBingoItems)
      .values({ bingoId, bingoItemId: itemId, marked })
      .onConflictDoUpdate({
        target: [selectedBingoItems.bingoId, selectedBingoItems.bingoItemId],
        set: { marked },
      });

    return NextResponse.json({}, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err.detail, { status: 422 });
  }
}

export async function DELETE(request: NextRequest) {
  const requestBody = await request.json();
  const { itemId } = requestBody;

  if (!itemId || itemId === "undefined") {
    return NextResponse.json(
      { message: "Body not well formatted" },
      { status: 422 }
    );
  }

  try {
    await db
      .delete(streamerBingosItems)
      .where(eq(streamerBingosItems.id, itemId));

    return NextResponse.json({}, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(err.detail, { status: 422 });
  }
}
