import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Singgah",
  description: "Dokumentasikan tempat dan makanan yang kamu kunjungi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="h-full">
      <body className={`${geist.className} antialiased min-h-full flex flex-col`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

