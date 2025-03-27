"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createAirbnbHome } from "../actions";
import { LuMenu } from "react-icons/lu";
import { useCallback, useState, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import useListModal from "./useListModal";
import useLoginModal from "./useLoginModal";
import useRegisterModal from "./useRegisterModal";
import { supabase } from "@/app/lib/supabase/supabaseClient";
import StatusModal from "./StatusModal";

export function UserNav() {
  const [user, setUser] = useState<any>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const router = useRouter();
  const listModal = useListModal();

  useEffect(() => {
    // Check current session when component mounts
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setShowStatusModal(true);
      router.refresh();
      
      // Auto-hide the status modal after 3 seconds
      setTimeout(() => {
        setShowStatusModal(false);
      }, 3000);
    }
  };

  const handleClick = useCallback(async () => {
    if (!user) return;

    try {
      const homeId = await createAirbnbHome({ userId: user.id });
      router.push(`/create/${homeId}/description`);
    } catch (error) {
      console.error("Failed to create home:", error);
    }
  }, [user, router]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="rounded-full border px-2 py-2 lg:px-4 lg:py-2 flex items-center gap-x-3">
            <LuMenu size={20} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px] z-[5000]  bg-gradient-to-b from-white via-[#fbe5f1] to-[#affab0]">
          {user ? (
            <>
              <DropdownMenuItem
                className="hover:text-white hover:bg-primary"
                onClick={() => listModal.onOpen()}
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
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem>
                <Button
                  onClick={loginModal.onOpen}
                  variant="outline"
                  className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                >
                  Sign In
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  onClick={registerModal.onOpen}
                  variant="outline"
                  className="hover:text-white hover:bg-hover bg-primary text-white w-full"
                >
                  Sign Up
                </Button>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status Modal for logout confirmation */}
      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        isSuccess={true}
        title="Logged out successfully"
        body={<p>You have been logged out</p>}
      />
    </>
  );
}