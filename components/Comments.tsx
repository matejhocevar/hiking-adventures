import { collection, orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

export default function Comments({ postRef, postAuthorUid }) {
  const q = query(collection(postRef, "comments"), orderBy("createdAt"));
  const [querySnapshot] = useCollection(q);

  const comments = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <div>
      <h2>Replies</h2>
      <CommentList
        comments={comments}
        postRef={postRef}
        postAuthorUid={postAuthorUid}
      />
      <CommentForm postRef={postRef} />
    </div>
  );
}

function CommentList({ comments, postRef, postAuthorUid }) {
  return comments && comments.length > 0 ? (
    comments.map((comment) => (
      <CommentItem
        comment={comment}
        postRef={postRef}
        postAuthorUid={postAuthorUid}
        key={comment.id}
      />
    ))
  ) : (
    <p className="card">Be the first one to post a reply!</p>
  );
}
