"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import { createAirbnbHome } from "../actions";
import { LuMenu } from "react-icons/lu";

export function UserNav() {
  const { user } = useUser();

  const createHomewithId = createAirbnbHome.bind(null, {
    userId: user?.id as string,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <LuMenu size={20} />
          <UserButton />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {user ? (
          <>
            <DropdownMenuItem className="hover:text-white hover:bg-primary">
              <form action={createHomewithId} className="w-full">
                <button type="submit" className="w-full text-start">
                  Add a new Listing
                </button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:text-white hover:bg-primary">
              <Link href="/all-listings" className="w-full">
                All Listings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:text-white hover:bg-primary">
              <Link href="/my-homes" className="w-full">
                My Listings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:text-white hover:bg-primary">
              <Link href="/favorites" className="w-full">
                My Favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:text-white hover:bg-primary">
              <Link href="/reservations" className="w-full">
                My Reservations
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton>
                <Button
                  variant="outline"
                  className="hover:text-white hover:bg-hover bg-primary text-white"
                >
                  Logout
                </Button>
              </SignOutButton>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <SignedOut>
                <SignInButton />
              </SignedOut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignedOut>
                <SignUpButton />
              </SignedOut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}