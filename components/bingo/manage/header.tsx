import Image from "next/image";
import Link from "next/link";

export function ManageHeader({
  fontFamily,
  twitchUserData,
}: {
  fontFamily: string;
  twitchUserData: any;
}) {
  return (
    <header
      className={`${fontFamily} flex items-center justify-between w-full px-8 py-4`}
    >
      <Link href="/">
        <h1 className={`${fontFamily} text-white text-2xl`}>Bingolino</h1>
      </Link>
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
  );
}
