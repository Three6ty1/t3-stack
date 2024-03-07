import { createClient } from "~/utils/supabase/client"

export default function Login() {
  const supabase = createClient();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    })
  }
  return (
    <button className="btn" onClick={handleLogin}>
      Login
    </button>
  )
}