import { doc, increment, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";

export default function PostViewsCount({ postRef }) {
  const [postViews, setPostViews] = useState();

  useEffect(() => {
    // Listen for document changes
    const unsubscribe = onSnapshot(doc(firestore, postRef.path), (doc) => {
      const data = doc.data();
      setPostViews(data.views || 0);
    });

    // Update page view count
    setDoc(postRef, { views: increment(1) }, { merge: true });

    return unsubscribe;
  }, []);

  return (
    postViews != null && (
      <span>
        Views: <strong>{postViews}</strong>
      </span>
    )
  );
}
