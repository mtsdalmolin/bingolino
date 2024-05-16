"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import MarkerPng from "../public/assets/marker.png";
import { version } from "../package.json";

import { Montserrat } from "next/font/google";
import {
  getCookie,
  isBingoCookieSet,
  setBingoCookie,
  BINGO_COOKIE_NAME,
} from "./cookie";

const montserrat = Montserrat({ subsets: ["latin"] });

const abilities = [
  "Votar em Shrek 2",
  "Rinite",
  "Dor nas costas",
  "Não dormiu direito",
  '"Vai miollo vai"',
  "Gripado",
  "Net caindo",
  "Dor no ombro",
  "Gank em mulher na twitch",
  "Ignora o chat",
  "Dor de cabeça",
  "Reclamar da twitch",
  '"Vontade de gritar"',
  "Live atrasada",
  "Problema no PC",
  '"Tô buito doente"',
  '"Agora eu caí"',
  '"Tô muito irritado"',
  "Assunto sexual",
  '"Caguei 3x hoje"',
  '"Caguei 6x hoje"',
  "Gemida",
  "Vitimismo",
  "Perguntar se a live caiu",
  "Tourette",
  "Falar sobre velhas",
  "Falar mal de café",
  "Falar mal de soulslike",
  "Falar mal da série Dark",
  "Falar mal de SP",
  '"Acordei meu pai"',
  '"Acordei minha mãe"',
  '"Morri"',
  "Falar do pai do Matheus com o padeiro",
  "Chegou a hora que eu não posso falar alto",
  "Culpar o próximo",
  "Falar mal de Livramento",
  "Falar que não tem dengue no Uruguai",
  '"Bá, um docinho agora"',
  '"Peraí que tão batendo aqui"',
  "Cantarolar bagaceirada",
  "Se finge de surdo",
  '"Esqueci meu remédio"',
  '"Eu tenho a memória ruim"',
];

const getAbility = () => {
  const index = parseInt(`${Math.random() * abilities.length}`);
  const ability = abilities.splice(index, 1);
  return ability[0];
};

const createAbility = (marked?: boolean) => {
  return { text: getAbility(), marked: marked ?? false };
};

const createBingoRow = (nColumns: number) => {
  const bingoRow = [];
  for (let i = 0; i < nColumns; i++) bingoRow.push(createAbility());

  return bingoRow;
};

const createBingo = (nRows: number, nColumns: number) => {
  const bingo = [];
  for (let i = 0; i < nRows; i++) bingo.push(createBingoRow(nColumns));
  return bingo;
};

export default function Home() {
  const [bingo, setBingo] = useState<ReturnType<typeof createBingo> | null>(
    null
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

      setBingoCookie(JSON.stringify(updatedBingo));
      return updatedBingo;
    });
  };

  useEffect(() => {
    if (isBingoCookieSet()) {
      setBingo(JSON.parse(getCookie(BINGO_COOKIE_NAME)));
      return;
    }
    const todaysBingo = createBingo(5, 5);
    setBingoCookie(JSON.stringify(todaysBingo));
    setBingo(todaysBingo);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className={`${montserrat.className} text-5xl`}>Bingolino</h1>
      <div className="grid grid-rows-5 grid-flow-col gap-2">
        {bingo?.map((row, rowIdx) =>
          row.map((item, itemIdx) => (
            <div
              key={Math.random()}
              className="w-[8rem] max-h-[8rem] aspect-square bg-slate-50 border-1 text-black flex items-center justify-center p-2 text-center cursor-pointer hover:opacity-[0.95]"
              onClick={() => markCard(`${rowIdx}x${itemIdx}`)}
            >
              <p>{item.text}</p>
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
      </div>
      <span className="absolute bottom-4">v{version}</span>
    </main>
  );
}
