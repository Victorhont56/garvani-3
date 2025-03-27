'use client';
import Image from "next/image";
import Link from "next/link";
import DesktopLogo from "../../public/airbnb-desktop.png";
import MobileLogo from "../../public/airbnb-mobile.webp";
import { UserNav } from "./UserNav";
import { MapFilterItems } from "./MapFilterItems";
import { SearchModalComponentTwo } from "./SearchComponentTwo";

export function NavbarTwo() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-md shadow-md">
      <div className="flex items-center justify-between container mx-auto px-5 lg:px-10 py-4 text-black">
        <Link href="/" className="flex items-center space-x-2">
           {/**  <Image
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
          /> **/}
          <div className="text-2xl">Garvani</div>
        </Link>

        <SearchModalComponentTwo />

        <UserNav />
      </div>

      <div className="text-black">
        <MapFilterItems />
      </div>
    </nav>
  );
}