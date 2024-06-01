import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const twitchToken = searchParams.get("twitchToken");
  const tokenType = searchParams.get("tokenType");

  if (!twitchToken || twitchToken === "undefined" || tokenType !== "bearer") {
    return NextResponse.json(
      { message: "Twitch token not well formatted" },
      { status: 422 }
    );
  }

  try {
    const twitchUser = await fetch("https://api.twitch.tv/helix/users", {
      headers: {
        Authorization: `Bearer ${twitchToken}`,
        "Client-Id": process.env.NEXT_PUBLIC_TWITCH_CLIENT_ID as string,
      },
    }).then((response) => response.json());

    return NextResponse.json(twitchUser.data[0], { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
