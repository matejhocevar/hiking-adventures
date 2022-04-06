import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { collection, collectionGroup, DocumentSnapshot, getDocs, getFirestore, limit, orderBy, query, startAfter, where, Timestamp, Query, DocumentData, DocumentReference, getDoc, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO(matej): Export Firebase config to .env file
const firebaseConfig = {
  apiKey: "AIzaSyDpoAAmQA5D0UjPaMm_uvIlfNgM03giq6I",
  authDomain: "nena-in-blaz.firebaseapp.com",
  projectId: "nena-in-blaz",
  storageBucket: "nena-in-blaz.appspot.com",
  messagingSenderId: "994915430018",
  appId: "1:994915430018:web:3a799122bf9132f2608e9b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(app);
export const storage = getStorage(app);

/// Helper functions

/**
 * Gets a user/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username) {
  const q = query(collection(firestore, 'users'), where('username', '==', username), limit(1));
  return (await getDocs(q)).docs[0];
}

/**
 * Gets a user/{uid} document with username
 * @param  {DocumentReference} userRef
 */
 export async function getPostsWithUserRef(userRef) {
  const q = query(
    collection(userRef, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  return (await getDocs(q)).docs;
}

/**
 * Gets a collection group posts
 * @param  {number} postLimit
 * @param  {number} cursor
 */
 export async function getFeedPosts(postLimit: number, cursor: number) {
  let q: Query<DocumentData>;

  if (cursor != null) {
    q = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(postLimit)
    );
  } else {
    q = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(postLimit)
    );
  }

  return (await getDocs(q)).docs;
}

/**
 * Gets a user/{uid}/posts/{slug} document reference
 * @param  {String} uid
 * @param  {String} slug
 * @return {DocumentReference<DocumentData>}
 */
 export async function getPostRefWithUidAndSlug(uid: String, slug: String) {
  return doc(firestore, `users/${uid}/posts/${slug}`);
}

/**
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}

export const fromMillis = Timestamp.fromMillis;