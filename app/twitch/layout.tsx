import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./tw.css";
import UseQueryClientProvider from "@/lib/react-query/provider";
import { LoadingBingo } from "@/components/bingo/states/loading-bingo";

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
      <body className={inter.className}>
        <Suspense
          fallback={
            <div className="min-h-screen min-w-screen grid content-center place-content-center">
              <LoadingBingo />
            </div>
          }
        >
          <UseQueryClientProvider>{children}</UseQueryClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
