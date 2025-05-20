import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutWrapper from "./root-layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slot Machine Game",
  description: "A thrilling slot machine game where you can test your luck and try to win big! But beware, the house has its ways...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutWrapper>
          {children}
        </RootLayoutWrapper>
      </body>
    </html>
  );
}
