import { collection, doc, increment, writeBatch } from "firebase/firestore";
import Link from "next/link";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { UserContext } from "../lib/context";
import { firestore, serverTimestampField } from "../lib/firebase";
import styles from "../styles/Comments.module.css";
import AuthCheck from "./AuthCheck";

export default function CommentForm({ postRef }) {
  const { user, username } = useContext(UserContext);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  let { isValid, isDirty } = errors;
  isValid = isValid || true;
  isDirty = isDirty || false;

  const commentRef = doc(collection(postRef, "comments"));

  const addComment = async ({ content }) => {
    const doc = {
      id: commentRef.id,
      username,
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
      content,
      createdAt: serverTimestampField(),
    };

    const batch = writeBatch(firestore);
    batch.set(commentRef, doc);
    batch.update(postRef, {
      commentsCount: increment(1),
    });
    await batch.commit();

    reset({ content: "" });

    toast.success("Comment successfully posted!");
  };

  return (
    <div className={styles.postComment}>
      <AuthCheck
        fallback={<Link href="/login">Login to add you comments</Link>}
      >
        <>
          <h4 className={styles.postCommentHeader}>Add your reply</h4>
          {errors?.content && (
            <p className="text-danger">{errors.content.message}</p>
          )}
          <form
            className={styles.commentForm}
            onSubmit={handleSubmit(addComment)}
          >
            <img
              className={styles.avatar}
              src="https://lh3.googleusercontent.com/a-/AOh14GjgXG5IE46eyn5Pw9he1LQx02xjwD8c2nXkeXjcXg=s96-c"
            />
            <textarea
              className={styles.commentTextInput}
              name="content"
              rows={3}
              {...register("content", {
                maxLength: { value: 20000, message: "Content is too long" },
                minLength: { value: 3, message: "Content is too short" },
                required: { value: true, message: "Content is required" },
              })}
            />
            <button
              type="submit"
              className="btn-green"
              disabled={isDirty && !isValid}
            >
              Post
            </button>
          </form>
        </>
      </AuthCheck>
    </div>
  );
}
