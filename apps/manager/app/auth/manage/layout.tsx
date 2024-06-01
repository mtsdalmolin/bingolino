import { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UseQueryClientProvider from "@/lib/react-query/provider";
import { TwitchUserDataContextProvider } from "@/context/twitch-user-data";
import { LoadingBingo } from "@/components/bingo/states/loading-bingo";

import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bingolino",
};

export default function RootLayout({
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
          <UseQueryClientProvider>
            <TwitchUserDataContextProvider>
              {children}
            </TwitchUserDataContextProvider>
          </UseQueryClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
