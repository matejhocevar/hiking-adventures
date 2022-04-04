import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

export function userUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
  
    useEffect(() => {
      let unsubscribe: Unsubscribe | void;
  
      if (user) {
        try {
          unsubscribe = onSnapshot(
            doc(firestore, "users", user.uid),
            (docRef) => {
              setUsername(docRef.data()?.username);
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        setUsername(null);
      }
  
      return unsubscribe;
    }, [user]);

    return {user, username};

}