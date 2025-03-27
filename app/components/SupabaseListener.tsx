// components/SupabaseListener.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase/supabaseClient";

export default function SupabaseListener({
  serverSession,
}: {
  serverSession: any;
}) {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [serverSession, router]);

  return null;
}