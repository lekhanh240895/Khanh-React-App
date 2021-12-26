import React, { useContext } from "react";
import useFirestore from "../components/hooks/useFirestore";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { find } from "lodash";

export const AppContext = React.createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();

  const addDocument = async (FirestoreCollection, data) => {
    await addDoc(collection(db, FirestoreCollection), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };

  const delDocument = (collection, docId) => {
    deleteDoc(doc(db, collection, docId));
  };

  const updateDocument = (collection, docID, data) => {
    updateDoc(doc(db, collection, docID), {
      ...data,
      lastModified: serverTimestamp(),
    });
  };

  const users = useFirestore("users", "");
  const userDoc = find(users, { email: user?.email });

  const value = { users, userDoc, addDocument, updateDocument, delDocument };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
