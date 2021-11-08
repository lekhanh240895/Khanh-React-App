import React, { useContext, useEffect } from "react";
import useFirestore from "../components/hooks/useFirestore";
// import { useAuth } from "./AuthContext";
import { db } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const AppContext = React.createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // const { user } = useAuth();
  // const condition = React.useMemo(() => {
  //   return {
  //     fieldName: "",
  //     operator: "",
  //     compareValue: "",
  //   };
  // }, []);

  const addDocument = (FirestoreCollection, data) => {
    addDoc(collection(db, FirestoreCollection), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };

  const users = useFirestore("users", "");
  useEffect(() => {
    console.log({ users });
  }, [users]);

  const value = { users, addDocument };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
