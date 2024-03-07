import { createClient } from "~/utils/supabase/client"

type Props = {
  handleClick: () => void;
}
export default function Login({ handleClick } : Props) {
  const supabase = createClient();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    })

    handleClick();
  }
  return (
    <button className="btn" onClick={handleLogin}>
      Login
    </button>
  )
}