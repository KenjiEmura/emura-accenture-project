import type { Metadata } from "next";

import { QueryProvider } from "@/_app/providers";

import "@/_app/styles/globals.css";

export const metadata: Metadata = {
  title: "都道府県別人口推移グラフ",
  description: "都道府県別の総人口推移をグラフで表示する SPA",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-900">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
