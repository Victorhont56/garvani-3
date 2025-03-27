'use client'

import { supabase } from '@/app/lib/supabase/supabaseClient'
import { useEffect, useState } from 'react'

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return user ? (
    <div>
      <p>Welcome {user.email}</p>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  ) : (
    <a href="/auth/login">Sign in</a>
  )
}