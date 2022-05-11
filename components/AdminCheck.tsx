import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function AdminCheck(props) {
  const { isAdmin } = useContext(UserContext);

  return isAdmin
    ? props.children
    : props.fallback || (
        <Link href="/login">You must have admin permissions</Link>
      );
}
