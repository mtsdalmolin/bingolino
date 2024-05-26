import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/lib/drizzle/db";
import { bingos } from "@/lib/drizzle/schema";

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
    })
    .from(bingos)
    .where(
      and(gt(bingos.expiredAt, new Date()), eq(bingos.streamer, streamerName))
    )
    .orderBy(desc(bingos.id));

  return NextResponse.json(bingo, { status: 200 });
}
