import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import HeroSection from "./components/Hero";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Garvani",
  description: "Garvani is a platform for finding and booking homes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    >
      <html lang="en">
        <body className={inter.className}>
          <Navbar />
          <HeroSection />
          {children}
        </body>
      </html>
   </ClerkProvider>
  );
}
