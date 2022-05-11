import { Unsubscribe } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "./firebase";

export function useUserData() {
    const [user] = useAuthState(auth);
    const [username, setUsername] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      let unsubscribe: Unsubscribe | void;
  
      if (user) {
        try {
          unsubscribe = onSnapshot(
            doc(firestore, "users", user.uid),
            (docRef) => {
              const data = docRef.data();
              setUsername(data?.username);
              setIsAdmin(data?.isAdmin ?? false);
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

    return {user, username, isAdmin};

}