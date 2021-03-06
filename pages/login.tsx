import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { UserContext } from "../lib/context";
import { useState, useContext, useEffect, useCallback } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import SignOutButton from "../components/SignOutButton";
import { useRouter } from "next/router";
import PageFooter from "../components/PageFooter";
import Metatags from "../components/Metatags";

export default function LoginPage({}) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />

  return (
    <>
      <main>
        {user ? (
          !username ? (
            <UsernameForm />
          ) : (
            <SignOutButton />
          )
        ) : (
          <SignInButton />
        )}
      </main>
      <PageFooter></PageFooter>
    </>
  );
}

// Sign in with Google button
function SignInButton() {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Metatags title="Prijava | Nena & Blaž" />

      <div style={{ padding: "50px 0" }}>
        <h1>Login to your account</h1>
        <p>
          In order to use some more features like:
          <ul>
            <li>React to posts,</li>
            <li>Write new posts,</li>
            <li>Manage existing posts</li>
          </ul>
          you must sign in with your Google account.
        </p>

        <button className="btn-google" onClick={signInWithGoogle}>
          <img src={"/google.png"} alt="Google logo" /> Sign in with Google
        </button>
      </div>
    </>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userRef = doc(firestore, "users", user.uid);
    const usernameRef = doc(firestore, "usernames", formValue);

    // Commit both docs together as a batch write.
    const batch = writeBatch(firestore);
    batch.set(userRef, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameRef, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (username.length >= 3) {
        const ref = doc(firestore, "usernames", username);

        const docSnap = await getDoc(ref);
        const exists = docSnap.exists();

        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return (
      <p className="text-success">
        Username &apos;{username}&apos; is available!
      </p>
    );
  } else if (username && !isValid) {
    if (username.length < 3) {
      return <p className="text-danger">Username is too short!</p>;
    }
    return <p className="text-danger">That username is already taken!</p>;
  } else {
    return <p></p>;
  }
}
