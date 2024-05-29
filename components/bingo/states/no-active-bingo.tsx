import Image from "next/image";
import BibleThumpPng from "@/public/assets/biblethump.png";

export function NoActiveBingo() {
  return (
    <>
      <Image src={BibleThumpPng} width={235} height={235} alt="Biblethump" />
      <p>Não há bingos ativos no momento!</p>
    </>
  );
}
