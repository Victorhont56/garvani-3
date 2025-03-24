import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import Footer from "../components/Footer";
import { NavbarThree } from "../components/NavbarThree";
import ListModal from "../components/ListModal";
import ClientOnly from "../components/ClientOnly";
import AllListings from "../components/AllListings";



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
            <NavbarThree />
            <ListModal />
           <div className="mt-[100px]"><AllListings /></div> 
           </ClientOnly> 
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
