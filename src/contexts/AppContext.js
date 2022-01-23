import React, { useContext, useState } from "react";
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
import moment from "moment";

export const AppContext = React.createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAddRoomShowed, setIsAddRoomShowed] = useState(false);
  const [isInviteMemberShowed, setIsInviteMemberShowed] = useState(false);
  const [isWorkSheetModalShowed, setIsWorkSheetModalShowed] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [showChatSidebar, setShowChatSidebar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());

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
  const userDoc = React.useMemo(
    () => find(users, { email: user?.email }),
    [users, user]
  );

  const roomsCondition = React.useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: user?.uid,
    };
  }, [user]);

  const rooms = useFirestore("rooms", roomsCondition);

  const selectedRoom = React.useMemo(
    () => find(rooms, { id: selectedRoomId }) || {},
    [rooms, selectedRoomId]
  );

  const usersCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);

  const members = useFirestore("users", usersCondition);

  const messagesCondition = React.useMemo(() => {
    return {
      fieldName: "roomId",
      operator: "==",
      compareValue: selectedRoomId,
    };
  }, [selectedRoomId]);

  const messages = useFirestore("messages", messagesCondition);

  const userWorkCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: user?.uid,
    };
  }, [user]);

  const userWork = useFirestore("worktime", userWorkCondition);

  const userWorkMonth = userWork.find(
    (work) =>
      work.month === selectedDate?.month() + 1 &&
      work.year === selectedDate?.year()
  );

  const value = {
    users,
    userDoc,
    addDocument,
    updateDocument,
    delDocument,
    rooms,
    isAddRoomShowed,
    setIsAddRoomShowed,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    members,
    isInviteMemberShowed,
    setIsInviteMemberShowed,
    showChatSidebar,
    setShowChatSidebar,
    messages,
    isWorkSheetModalShowed,
    setIsWorkSheetModalShowed,
    selectedDate,
    setSelectedDate,
    userWorkMonth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
