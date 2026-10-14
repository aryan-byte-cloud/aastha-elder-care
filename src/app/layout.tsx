import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "material-symbols/outlined.css";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aastha - Senior Community Care India",
  description: "Dignified, community-driven caregiving and daily reassurance for elders across neighborhoods in India.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full antialiased scroll-smooth ${nunitoSans.variable}`}>
      <body className={`min-h-full flex flex-col bg-[#FAF7F2] text-[#121E1C] ${nunitoSans.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
