import { createClient } from "~/utils/supabase/client"

type Props = {
  handleClick: () => void;
}

export default function SignOut({ handleClick } : Props) {
  const supabase = createClient();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    handleClick();
  }
  return (
    <button className="btn" onClick={handleSignOut}>
      Sign Out
    </button>
  )
}