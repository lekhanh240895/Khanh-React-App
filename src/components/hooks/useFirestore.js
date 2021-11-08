import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function useFirestore(FirestoreCollection, condition) {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    //Listen to multiple documents in collection Users
    let collectionRef = collection(db, FirestoreCollection);
    let q;

    if (condition) {
      if (!condition.compareValue || !condition.compareValue.length) {
        return;
      }

      q = query(
        collectionRef,
        where(condition.fieldName, condition.operator, condition.compareValue)
      );
    } else {
      q = collectionRef;
    }

    const unsub = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDocuments(data);
    });

    return unsub;
  }, [FirestoreCollection, condition]);

  return documents;
}
