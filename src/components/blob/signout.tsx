import { createClient } from "~/utils/supabase/client"

export default function SignOut() {
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
  }
  return (
    <button className="btn" onClick={handleSignOut}>
      Sign Out
    </button>
  )
}