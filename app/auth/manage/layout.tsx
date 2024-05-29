import type { Metadata } from "next";
import { Inter } from "next/font/google";
import UseQueryClientProvider from "@/lib/react-query/provider";
import { TwitchUserDataContextProvider } from "@/context/twitch-user-data";
import "../../../app/globals.css";

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
        <UseQueryClientProvider>
          <TwitchUserDataContextProvider>
            {children}
          </TwitchUserDataContextProvider>
        </UseQueryClientProvider>
      </body>
    </html>
  );
}
