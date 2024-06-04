import Image from "next/image";
import FacePalmPng from "@/public/assets/facepalm.png";

export function NotEnoughItems() {
  return (
    <>
      <Image src={FacePalmPng} width={500} height={500} alt="Facepalm" />
      <p>
        O streamer não cadastrou o número mínimo de itens para criarmos um
        bingo!
      </p>
    </>
  );
}
