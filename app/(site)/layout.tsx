import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Navbar } from "../components/Navbar";
import HeroSection from "../components/Hero";
import Footer from "../components/Footer";
import ListModal from "../components/ListModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Garvani",
  description: "Garvani is a platform for finding and booking homes",
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <Navbar />
          <HeroSection />
          <ListModal />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
