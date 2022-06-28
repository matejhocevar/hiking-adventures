import Link from "next/link";
import Image from "next/image";

export default function PostFeed({ posts, admin = false }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  const createdAtRaw =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();
  const createdAt = createdAtRaw
    ? new Intl.DateTimeFormat("sl-SI", {
        dateStyle: "medium",
        timeStyle: "short",
      })
        .format(createdAtRaw)
        .replace(",", "")
    : null;

  return (
    <div className="card">
      <Link href={`/${post.username}`} passHref>
        <a>
          <strong>By @{post.username} at </strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`} passHref>
        <a>
          <strong>{createdAt != null && createdAt}</strong>
        </a>
      </Link>

      <Link href={`/${post.username}/${post.slug}`} passHref>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>

      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>

        <Link href={`/${post.username}/${post.slug}#comments`} passHref>
          <div className="commentsCount">
            <Image
              src={"/comment_icon.png"}
              width="24"
              height="24"
              alt="Show replies"
            />
            <strong>{post.commentsCount ?? 0}</strong>
          </div>
        </Link>
      </footer>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`} passHref>
            <h3>
              <button className="btn-blue">Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className="text-success">Live</p>
          ) : (
            <p className="text-danger">Unpublished</p>
          )}
        </>
      )}
    </div>
  );
}
