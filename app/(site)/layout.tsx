import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "../components/Navbar";
import HeroSection from "../components/Hero";
import Footer from "../components/Footer";
import ListModal from "../components/ListModal";
import ClientOnly from "../components/ClientOnly";
import LoginModal from "../components/LoginModal";
import RegisterModal from "../components/RegisterModal";
import { createClient } from '@supabase/supabase-js';
import { cookies } from "next/headers";
import { AuthProvider } from '@/app/components/auth-provider'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Welcome to Garvani",
  description: "Garvani is a platform for finding and booking homes",
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
      <AuthProvider> 
          <ClientOnly>
            <Navbar />
            <HeroSection />
            <ListModal />
            <RegisterModal />
            <LoginModal />
          </ClientOnly>  
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}