import { useState } from "react";
import Loader from "../components/Loader";
import PageFooter from "../components/PageFooter";
import PostFeed from "../components/PostFeed";
import { fromMillis, getFeedPosts, postToJSON } from "../lib/firebase";

// Max post to query per page
const LIMIT = 5;

export async function getServerSideProps(context) {
  const posts = (await getFeedPosts(LIMIT, null)).map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const newPosts = (await getFeedPosts(LIMIT, cursor)).map(postToJSON);
    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <>
      <main>
        <PostFeed posts={posts} />

        {!loading && !postsEnd && (
          <button onClick={getMorePosts}>Load more</button>
        )}

        <Loader show={loading} />

        {postsEnd && "You have reached the end!"}
      </main>
      <PageFooter></PageFooter>
    </>
  );
}
