import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "./providers/LenisProvider";
import LoadingScreen from "@/components/ui/LoadingScreen";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "V I P E R - manishmellow",
  description: "A cinematic 3D sports car experience.",
  icons: {
    icon: "/assets/image.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" dir="ltr">
      <body className={`${inter.className} antialiased selection:bg-white/20 overflow-x-hidden bg-black`}>
        <LoadingScreen />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
