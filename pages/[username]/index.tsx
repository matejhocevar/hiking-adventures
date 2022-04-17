import PageFooter from "../../components/PageFooter";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import {
  getPostsWithUserRef,
  getUserWithUsername,
  postToJSON,
} from "../../lib/firebase";

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsDoc = await getPostsWithUserRef(userDoc.ref);
    posts = postsDoc.map(postToJSON);
  } else {
    return {
      notFound: true,
    };
  }

  return { props: { user, posts } };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <>
      <main>
        <UserProfile user={user}></UserProfile>
        <PostFeed posts={posts}></PostFeed>
      </main>
      <PageFooter></PageFooter>
    </>
  );
}
