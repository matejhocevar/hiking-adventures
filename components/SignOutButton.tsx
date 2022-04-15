import { useRouter } from "next/router";
import { auth } from "../lib/firebase";

export default function SignOutButton() {
  const router = useRouter();

  const signOut = async () => {
    await auth.signOut();
    router.replace("/");
  };

  return <button onClick={signOut}>Sign Out</button>;
}
