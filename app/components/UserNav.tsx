"use client"; // Mark as a Client Component

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
  useUser, // Import useUser from Clerk
} from "@clerk/nextjs";
import Link from "next/link";
import { createAirbnbHome } from "../actions";
import { LuCircleUser } from "react-icons/lu";
import { LuMenu } from "react-icons/lu";

export function UserNav() {
  // Use Clerk's useUser hook to get the authenticated user
  const { user } = useUser();

  // Bind the createAirbnbHome action with the userId
  const createHomewithId = createAirbnbHome.bind(null, {
    userId: user?.id as string, // Use optional chaining to safely access user.id
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <LuMenu size={20} />
          <LuCircleUser className="w-6 h-6 lg:w-5 lg:h-5" />
          {/* Use Clerk's UserButton for profile picture */}
          <UserButton />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {user ? (
          <>
            <DropdownMenuItem>
              <form action={createHomewithId} className="w-full">
                <button type="submit" className="w-full text-start">
                  Airbnb your Home
                </button>
              </form>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/my-homes" className="w-full">
                My Listings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/favorites" className="w-full">
                My Favorites
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/reservations" className="w-full">
                My Reservations
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton>
                <Button variant="outline">Logout</Button>
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