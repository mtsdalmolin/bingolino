import Image from "next/image";
import MarkerPng from "@/public/assets/marker.png";

export function LoadingBingo() {
  return (
    <article className="flex flex-col justify-center items-center gap-10">
      <Image
        className="animate-spin"
        src={MarkerPng}
        width={235}
        height={235}
        alt="Marcador com a cara do Inoxville"
      />
      <p>Carregando itens do bingo...</p>
    </article>
  );
}
