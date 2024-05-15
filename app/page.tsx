"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import MarkerPng from "../public/assets/marker.png";
import { version } from "../package.json";

import { Montserrat } from "next/font/google";
const montserrat = Montserrat({ subsets: ["latin"] });

const abilities = [
  "Votar em Shrek 2",
  "Rinite",
  "Dor nas costas",
  "Não dormi direito",
  '"Vai miollo vai"',
  "Gripado",
  "Net caindo",
  "Dor no ombro",
  "Gank em mulher na twitch",
  '"No mínimo"',
  "Ignora todo mundo",
  "Vizinho com música alta",
  "Dor de cabeça",
  "Reclamar da twitch",
  '"Vontade de gritar"',
  "Live atrasada",
  "Problema no PC",
  '"Do muibo boente"',
  '"Agora eu caí"',
  '"To muito irritado"',
  '"Queria muito comer um doce"',
  "Assunto sexual",
  '"Caguei 15x hoje"',
  "Playlista com Foo Fighters",
  "Gemida",
  "Vitimismo",
  "Perguntar se a live caiu 3x",
  "Tourette",
  "Falar sobre velhas",
  "Falar mal de café",
  "Falar mal de soulslike",
  '"Acordei meu pai"',
  '"Acordei minha mãe"',
];

const getAbility = () => {
  const index = parseInt(`${Math.random() * abilities.length}`);
  const ability = abilities.splice(index, 1);
  return ability;
};

const bingo = [
  [
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
  ],
  [
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
  ],
  [
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
  ],
  [
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
    { text: getAbility(), marked: false },
  ],
];

export default function Home() {
  const [card, setCard] = useState<typeof bingo | null>(null);

  const markCard = (cardIndex: string) => {
    setCard(
      (prevState) =>
        prevState?.map((row, rowIdx) =>
          row.map((item, itemIdx) =>
            `${rowIdx}x${itemIdx}` === cardIndex
              ? { ...item, marked: !item.marked }
              : item
          )
        ) ?? null
    );
  };

  useEffect(() => {
    setCard(bingo);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className={`${montserrat} text-5xl`}>Binguino</h1>
      <div className="grid grid-rows-4 grid-flow-col">
        {card?.map((row, rowIdx) =>
          row.map((item, itemIdx) => (
            <div
              key={Math.random()}
              className="h-40 aspect-square bg-slate-50 border-2 border-black text-black flex items-center justify-center p-4 text-center"
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
