import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div>
      <Link
        prefetch={false}
        href={{
          pathname: "/[username]",
          query: { username: "matej" },
        }}
      >
        <a>Matej's profile</a>
      </Link>

      <button onClick={() => toast.success("Hello toast 🍿")}>
        Show me magic!
      </button>
      <Loader show />
    </div>
  );
}
