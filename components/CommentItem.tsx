import { doc, increment, writeBatch } from "firebase/firestore";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { firestore } from "../lib/firebase";
import styles from "../styles/Comments.module.css";

export default function CommentItem({ comment, postRef, postAuthorUid }) {
  const { user } = useContext(UserContext);
  const { id, uid, displayName, username, photoURL, content } = comment;

  const [isHover, setIsHover] = useState(false);

  const isAuthor = postAuthorUid === uid;
  const isCommentor = user.uid === uid;

  const createdAt =
    typeof comment?.createdAt === "number"
      ? new Date(comment.createdAt)
      : comment.createdAt?.toDate();

  const deleteComment = async () => {
    try {
      const batch = writeBatch(firestore);
      batch.delete(doc(postRef, "comments", id));
      batch.update(postRef, {
        commentsCount: increment(-1),
      });
      await batch.commit();

      toast.success("Comment successfully deleted!");
    } catch (error) {
      toast.error("Unable to delete comment");
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`${styles.commentBox} ${
        isAuthor ? styles.right : styles.left
      }`}
    >
      <p
        className={`${styles.comment}  ${
          isAuthor ? styles.author : styles.reader
        }`}
      >
        {content}
      </p>
      <div className={styles.user}>
        <img className={styles.avatar} src={photoURL} />
        <div className={styles.userBar}>
          <div className={styles.userData}>
            <span className={styles.displayName}>{displayName}</span>
            <small className={styles.createdAt}>
              {createdAt != null &&
                new Intl.DateTimeFormat("sl-SI", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(createdAt)}
            </small>
          </div>
          <div>
            {isHover && isCommentor && (
              <span
                className={styles.deleteComment}
                onClick={() => deleteComment()}
              >
                Delete
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
