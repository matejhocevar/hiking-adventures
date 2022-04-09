import styles from "../styles/Post.module.css";
import { deleteField, doc, increment, writeBatch } from "firebase/firestore";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";
import { useState } from "react";
import emoji from "emoji-dictionary";
import toast from "react-hot-toast";

import dynamic from "next/dynamic";
const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function Reactions({ postRef }) {
  const userReactionsRef = doc(postRef, `reactions/${auth.currentUser.uid}`);
  const [userReactionsDoc] = useDocument(userReactionsRef);

  const [post] = useDocumentData(postRef);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const addReaction = async (type: string) => {
    const uid = auth.currentUser.uid;
    const batch = writeBatch(firestore);

    const reactionCountName = `${type}__count`;
    const postData = {};
    postData[reactionCountName] = increment(1);
    batch.update(postRef, postData);

    const reactionsData = { uid };
    reactionsData[type] = true;
    batch.set(userReactionsRef, reactionsData, { merge: true });

    await batch.commit();
  };

  const removeReaction = async (type: string) => {
    const batch = writeBatch(firestore);

    const reactionCountName = `${type}__count`;
    const postData = {};
    postData[reactionCountName] = increment(-1);
    batch.update(postRef, postData);

    const reactionsData = {};
    reactionsData[type] = deleteField();
    batch.set(userReactionsRef, reactionsData, { merge: true });

    await batch.commit();
  };

  const reactions = Object.entries(post || {}).filter(([k, v]) =>
    k.includes("__count")
  );
  reactions.sort();

  const renderReactions: any[] = reactions.map(([k, r], i) => {
    const countName = k;
    const name = countName.replace("__count", "");
    const countNum = (post && countName in post && post[countName]) || 0;
    const isReactionUsed = userReactionsDoc?.exists
      ? userReactionsDoc.data() != null && name in userReactionsDoc.data()
      : false;
    const action = isReactionUsed ? removeReaction : addReaction;

    return (
      <>
        {countNum > 0 ? (
          <button
            className={isReactionUsed ? "btn-green" : ""}
            key={`reaction-${i}`}
            title={name}
            onClick={() => action(name)}
          >
            <span className="icon">{emoji.getUnicode(name)}</span>
            <span className="number">{countNum}</span>
          </button>
        ) : null}
      </>
    );
  });

  const onEmojiClick = (event, emojiObject) => {
    const name = emojiObject.names[1];
    try {
      const ableToDisplayEmoji = emoji.getUnicode(name) != null;
      if (!ableToDisplayEmoji) {
        throw Error("Unable to display emoji");
      }

      addReaction(name);
      setShowEmojiPicker(false);
    } catch (error) {
      toast.error(`Unable to react with emoji ${emojiObject.emoji}`);
    }
  };

  return (
    <>
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
        {showEmojiPicker ? "-" : "+"}
      </button>
      <div className={styles.reactions}>{renderReactions}</div>
      {showEmojiPicker ? (
        <Picker onEmojiClick={onEmojiClick} disableSkinTonePicker={true} />
      ) : null}
    </>
  );
}
