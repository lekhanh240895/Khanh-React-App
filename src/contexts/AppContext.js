import React, { useContext, useMemo } from "react";
import useFirestore from "../components/hooks/useFirestore";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";

export const AppContext = React.createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const addDocument = (FirestoreCollection, data) => {
    addDoc(collection(db, FirestoreCollection), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };

  const updateDocument = (collection, docID, data) => {
    updateDoc(doc(db, collection, docID), {
      ...data,
      lastModified: serverTimestamp(),
    });
  };

  const users = useFirestore("users", "");

  //Get DOC ID
  const condition = useMemo(() => {
    return {
      fieldName: "email",
      operator: "==",
      compareValue: user?.email,
    };
  }, [user?.email]);

  const userDocs = useFirestore("users", condition);

  const value = { users, userDocs, addDocument, updateDocument };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
