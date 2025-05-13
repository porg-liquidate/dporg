import type { Metadata } from "next";
import "./globals.css";
import { headers } from 'next/headers' 
import ContextProvider from "@/context";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Porg",
  description: "Your One Click Wallet Liquidation",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get('cookie');

  return (
    <>
      <Toaster position="bottom-right" />
      <html lang="en" data-nighteye="disabled">
        <body>
          <ContextProvider cookies={cookies}>{children}</ContextProvider>
        </body>
      </html>
    </>
  );
}
