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
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import useListModal from "./useListModal";

export function UserNav() {
  const { user } = useUser();
  const router = useRouter();
  const listModal = useListModal();

  const handleClick = useCallback(async () => {
    if (!user) return;

    try {
      // Call your server action and await the new home ID
      const homeId = await createAirbnbHome({ userId: user.id });

      // Navigate to the DescriptionPage for the new listing
      router.push(`/create/${homeId}/description`);
    } catch (error) {
      console.error("Failed to create home:", error);
    }
  }, [user, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <LuMenu size={20} />
          <UserButton />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px] z-[5000]">
        {user ? (
          <>
            <DropdownMenuItem
              className="hover:text-white hover:bg-primary"
              onClick={() => {
                console.log("Opening modal");
                listModal.onOpen();
              }}
            >
              <button type="button" className="w-full text-start">
                Add a new Listing
              </button>
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
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                >
                  Sign In
                </Button>
              </SignInButton>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignUpButton mode="modal">
                <Button
                  variant="outline"
                  className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}