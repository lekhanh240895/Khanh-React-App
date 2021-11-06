import { db } from "./config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const addDocument = (collections, data) => {
  addDoc(collection(db, collections), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

