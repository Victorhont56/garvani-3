/* eslint-disable @next/next/no-img-element */
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { createAirbnbHome } from "../actions";
import { auth } from "@clerk/nextjs";


export async function UserNav() {
  // Use Clerk's getAuth instead of Kinde's getKindeServerSession
  const { userId } = auth();

  const createHomewithId = createAirbnbHome.bind(null, {
    userId: userId as string,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
          <MenuIcon className="w-6 h-6 lg:w-5 lg:h-5" />

          {/* Use Clerk's UserButton for profile picture */}
          <UserButton />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {userId ? (
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
              <Link href="/sign-in">
                <Button variant="outline">Login</Button>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
