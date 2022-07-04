import styles from "../../styles/Post.module.css";
import {
  collectionGroup,
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  firestore,
  getPostRefWithUidAndSlug,
  getUserWithUsername,
  postToJSON,
} from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import PostContent from "../../components/PostContent";
import Metatags from "../../components/Metatags";
import AuthCheck from "../../components/AuthCheck";
import Link from "next/link";
import Reactions from "../../components/Reactions";
import PageFooter from "../../components/PageFooter";
import PostViewsCount from "../../components/PostViewsCount";
import AdminCheck from "../../components/AdminCheck";
import Comments from "../../components/Comments";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc?.exists) {
    const postRef: DocumentReference<DocumentData> =
      await getPostRefWithUidAndSlug(userDoc.id, slug);
    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 10000,
  };
}

export async function getStaticPaths() {
  const q = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc")
  );

  const paths = (await getDocs(q)).docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: {
        username,
        slug,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
}

export default function PostPage(props) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  console.log(post);

  return (
    <>
      <main className={styles.container}>
        <Metatags title={post.title} description={post.description} />

        <section>
          <PostContent post={post} />
        </section>

        <section className="controls card">
          <div className={styles.controlsContainer}>
            <AuthCheck
              fallback={
                <Link href="/login" passHref>
                  <button>👍 Sign Up to like</button>
                </Link>
              }
            >
              <Reactions postRef={postRef} />
            </AuthCheck>

            <AdminCheck fallback={<></>}>
              <PostViewsCount postRef={postRef} />
            </AdminCheck>
          </div>
        </section>

        <section id="comments" className="card">
          <Comments postRef={postRef} postAuthorUid={post.uid}></Comments>
        </section>
      </main>

      <PageFooter></PageFooter>
    </>
  );
}
