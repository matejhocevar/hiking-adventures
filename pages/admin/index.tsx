import styles from "../../styles/Admin.module.css";
import { collection, doc, orderBy, query, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { firestore, auth, serverTimestampField } from "../../lib/firebase";

import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import PageFooter from "../../components/PageFooter";

export default function AdminPostsPage({}) {
  return (
    <>
      <main>
        <AuthCheck>
          <PostList />
          <CreateNewPost />
        </AuthCheck>
      </main>
      <PageFooter></PageFooter>
    </>
  );
}

function PostList() {
  const q = query(
    collection(firestore, `users/${auth.currentUser.uid}/posts`),
    orderBy("createdAt")
  );
  const [querySnapshot] = useCollection(q);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      {posts != null && posts.length > 0 ? <h1>Manager you Posts</h1> : null}
      <PostFeed posts={posts} admin></PostFeed>
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(firestore, `/users/${uid}/posts/${slug}`);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestampField(),
      updatedAt: serverTimestampField(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <>
      <h1>Create a new Post</h1>
      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My next adventure!"
          className={styles.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
          Create New Post
        </button>
      </form>
    </>
  );
}
