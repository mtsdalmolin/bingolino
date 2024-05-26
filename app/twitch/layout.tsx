import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./tw.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Extensão da Twitch do Bingolino",
};

export default function TwitchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
