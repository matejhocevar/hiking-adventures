import styles from "../../styles/Admin.module.css";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import {
  useDocumentData,
  useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore, serverTimestampField } from "../../lib/firebase";
import Link from "next/link";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import ImageUploader from "../../components/ImageUploader";
import MarkdownInstructions from "../../components/MarkdownInstructions";
import PageFooter from "../../components/PageFooter";

export default function AdminPostEdit({}) {
  return (
    <>
      <main>
        <AuthCheck>
          <PostManager />
        </AuthCheck>
      </main>
      <PageFooter></PageFooter>
    </>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = doc(
    firestore,
    `/users/${auth.currentUser.uid}/posts/${slug}`
  );
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`} passHref>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  let { isValid, isDirty } = errors;
  isValid = isValid || true;
  isDirty = isDirty || false;

  const updatePost = async ({ content, published }) => {
    await setDoc(
      postRef,
      {
        content,
        published,
        updatedAt: serverTimestampField(),
      },
      { merge: true }
    );

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <>
      <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="card">
            <ReactMarkdown>{watch("content")}</ReactMarkdown>
          </div>
        )}

        <div className={preview ? styles.hidden : styles.controls}>
          <ImageUploader />

          <textarea
            name="content"
            {...register("content", {
              maxLength: { value: 20000, message: "Content is too long" },
              minLength: { value: 10, message: "Content is too short" },
              required: { value: true, message: "Content is required" },
            })}
          ></textarea>

          {errors?.content && (
            <p className="text-danger">{errors.content.message}</p>
          )}

          <fieldset>
            <input
              id="published"
              className={styles.checkbox}
              name="published"
              type="checkbox"
              {...register("published")}
            />
            <label htmlFor="published">Published</label>
          </fieldset>

          <button
            type="submit"
            className="btn-green"
            disabled={isDirty && !isValid}
          >
            Save Changes
          </button>
        </div>
      </form>
      <MarkdownInstructions />
    </>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("Are you sure?");
    if (doIt) {
      await deleteDoc(postRef);
      router.push("/admin");
      toast("Post deleted successfully ", { icon: "🗑️" });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}
