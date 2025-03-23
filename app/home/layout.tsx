import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import Footer from "../components/Footer";
import { NavbarTwo } from "../components/NavbarTwo";
import ListModal from "../components/ListModal";
import ClientOnly from "../components/ClientOnly";



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
           <ClientOnly>  
            <NavbarTwo />
            <ListModal />
           </ClientOnly> 
          <main className="flex-grow mt-[150px]">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
