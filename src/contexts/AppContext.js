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
import { find, orderBy, reject, some } from "lodash";
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
  const [showUploadMessageImagesModal, setShowUploadMessageImagesModal] =
    useState(false);
  const [showUploadStatusImagesModal, setShowUploadStatusImagesModal] =
    useState(false);
  const [showUploadCommentImagesModal, setShowUploadCommentImagesModal] =
    useState(false);
  const [uploadMessageImgages, setUploadMessageImgages] = useState([]);
  const [uploadStatusImages, setUploadStatusImages] = useState([]);
  const [commentImages, setCommentImages] = useState([]);
  const [selectedStatusId, setSelectedStatusId] = useState("");
  const [showUploadAvatarModal, setShowUploadAvatarModal] = useState(false);
  const [showUploadImagesModal, setShowUploadImagesModal] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showChatWindow, setShowChatWindow] = useState(false);

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
  const allMessages = useFirestore("messages", "");

  const userWorkCondition = React.useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: userDoc?.uid,
    };
  }, [userDoc]);

  const userWork = orderBy(
    useFirestore("worktime", userWorkCondition),
    ["year", "month"],
    ["asc", "asc"]
  );

  const userWorkInMonth = userWork.find(
    (work) =>
      work.month === selectedDate?.month() + 1 &&
      work.year === selectedDate?.year()
  );

  const statuses = useFirestore("statuses", "");

  const handleDeleteStatus = (status) => {
    const selectedStatus = find(statuses, { id: status.id });

    delDocument("statuses", selectedStatus.id);
  };

  const handleReactStatus = async (status, emoReact) => {
    const { displayName, email, photoURL, uid } = userDoc;

    const isUserReactStatus = some(status.people, { uid: uid });

    if (!isUserReactStatus) {
      return updateDocument("statuses", status.id, {
        people: status.people.concat({
          displayName,
          email,
          photoURL,
          uid,
          react: emoReact,
        }),
      });
    }

    if (emoReact === "thumbs-up") {
      const updatePeopleReact = status.people.filter((person) => {
        return person.uid !== uid;
      });

      updateDocument("statuses", status.id, {
        people: updatePeopleReact,
      });
    } else {
      const updatePeopleReact = status.people.map((person) => {
        return person.uid === uid ? { ...person, react: emoReact } : person;
      });

      updateDocument("statuses", status.id, {
        people: updatePeopleReact,
      });
    }
  };

  //Comment
  const handleToggleCommentTab = (status) => {
    updateDocument("statuses", status.id, {
      isCommentTabOpened: !status.isCommentTabOpened,
    });
  };

  const handleDeleteComment = (status, comment) => {
    updateDocument("statuses", status.id, {
      comments: reject(status.comments, comment),
    });
  };

  const handleReactComment = (status, comment, emoReact) => {
    const { displayName, photoURL, email, uid } = userDoc;

    const isUserLikedComment = some(comment.people, {
      uid: uid,
    });

    const newComments = status.comments.map((dbComment) => {
      if (dbComment.id === comment.id) {
        if (!isUserLikedComment) {
          return {
            ...dbComment,
            people: dbComment.people.concat({
              displayName,
              email,
              photoURL,
              uid,
              react: emoReact,
            }),
          };
        }

        if (emoReact === "thumbs-up") {
          const updatedPeopleReactComment = dbComment.people.filter(
            (person) => person.uid !== uid
          );
          return { ...dbComment, people: updatedPeopleReactComment };
        } else {
          const updatedPeopleReactComment = dbComment.people.map((person) => {
            return person.uid === uid ? { ...person, react: emoReact } : person;
          });
          return { ...dbComment, people: updatedPeopleReactComment };
        }
      } else {
        return dbComment;
      }
    });

    updateDocument("statuses", status.id, {
      comments: newComments,
    });
  };

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
    userWorkInMonth,
    statuses,
    showUploadMessageImagesModal,
    setShowUploadMessageImagesModal,
    showUploadStatusImagesModal,
    setShowUploadStatusImagesModal,
    uploadMessageImgages,
    setUploadMessageImgages,
    userWork,
    uploadStatusImages,
    setUploadStatusImages,
    showUploadCommentImagesModal,
    setShowUploadCommentImagesModal,
    commentImages,
    setCommentImages,
    selectedStatusId,
    setSelectedStatusId,
    showUploadAvatarModal,
    setShowUploadAvatarModal,
    showUploadImagesModal,
    setShowUploadImagesModal,
    allMessages,
    handleDeleteStatus,
    handleReactStatus,
    handleToggleCommentTab,
    handleDeleteComment,
    handleReactComment,
    isUser,
    setIsUser,
    photoIndex,
    setPhotoIndex,
    scrollPosition,
    setScrollPosition,
    showEditPost,
    setShowEditPost,
    showChatWindow,
    setShowChatWindow,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
