import { db } from "./config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const addDocument = (FirestoreCollection, data) => {
  addDoc(collection(db, FirestoreCollection), {
    ...data,
    createdAt: serverTimestamp(),
  });
};

