'use client';
import Image from "next/image";
import Link from "next/link";
import DesktopLogo from "../../public/airbnb-desktop.png";
import MobileLogo from "../../public/airbnb-mobile.webp";
import { UserNav } from "./UserNav";
import { SearchModalCompnent } from "./SearchComponent";
import { MapFilterItems } from "./MapFilterItems";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
      ${isScrolled ? "bg-white/60 backdrop-blur-md shadow-md" : "bg-transparent"}`}>
      
      <div className={`flex items-center justify-between container mx-auto px-5 lg:px-10 py-4 
        ${isScrolled ? "text-black" : "text-white"}`}>

        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={DesktopLogo}
            alt="Desktop Logo"
            className="w-32 hidden lg:block"
            priority
          />
          <Image
            src={MobileLogo}
            alt="Mobile Logo"
            className="block lg:hidden w-12"
            priority
          />
        </Link>

        <SearchModalCompnent isScrolled={isScrolled} />


        <UserNav />
      </div>

      <div className={`${isScrolled ? "text-black" : "text-white"} transition-colors duration-300`}>
        <MapFilterItems />
      </div>
    </nav>
  );
}
