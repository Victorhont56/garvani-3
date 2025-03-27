import { supabase } from '@/app/lib/supabase/supabaseClient'

export default function LoginPage() {
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github', // or 'google', 'azure', etc.
    })
    if (error) console.error(error)
  }

  return (
    <div>
      <button onClick={handleSignIn}>Sign in with GitHub</button>
    </div>
  )
}