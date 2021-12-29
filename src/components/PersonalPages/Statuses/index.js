import { v1 as uuidv1 } from "uuid";
import { find, reject, some } from "lodash";
import { useAppContext } from "../../../contexts/AppContext";
import Status from "../Status";

const Statuses = ({ isUser, statuses }) => {
  const { updateDocument, delDocument, userDoc } = useAppContext();

  const handleDeleteStatus = (status) => {
    const selectedStatus = find(statuses, { id: status.id });

    delDocument("statuses", selectedStatus.id);
  };

  const handleLikeStatus = (status) => {
    const selectedStatus = find(statuses, { id: status.id });
    const { displayName, email, photoURL, uid } = userDoc;

    const isUserLikedStatus = some(status.likedPeople, { uid: uid });

    if (!isUserLikedStatus) {
      updateDocument("statuses", selectedStatus.id, {
        likedPeople: selectedStatus.likedPeople.concat({
          displayName,
          email,
          photoURL,
          uid,
        }),
      });
    } else {
      updateDocument("statuses", selectedStatus.id, {
        likedPeople: reject(selectedStatus.likedPeople, {
          displayName,
          email,
          photoURL,
          uid,
        }),
      });
    }
  };

  //Comment
  const handleToggleCommentTab = (status) => {
    const selectedStatus = find(statuses, { id: status.id });

    updateDocument("statuses", selectedStatus.id, {
      isCommentTabOpened: !status.isCommentTabOpened,
    });
  };

  const onPostComment = (data, status) => {
    const selectedStatus = find(statuses, { id: status.id });
    const { displayName, photoURL, email, uid } = userDoc;

    updateDocument("statuses", selectedStatus.id, {
      comments: selectedStatus.comments.concat({
        content: data.comment,
        commentedAt: new Date(),
        id: uuidv1(),
        displayName,
        photoURL,
        email,
        uid,
        likedPeople: [],
      }),
    });
  };

  const handleDeleteComment = (status, comment) => {
    const selectedStatus = find(statuses, { id: status.id });

    updateDocument("statuses", selectedStatus.id, {
      comments: reject(status.comments, comment),
    });
  };

  const handleLikeComment = async (status, comment) => {
    const selectedStatus = find(statuses, { id: status.id });
    const selectedComment = find(selectedStatus.comments, { id: comment.id });

    const { displayName, photoURL, email, uid } = userDoc;

    const isUserLikedComment = some(selectedComment.likedPeople, {
      uid: uid,
    });

    const newComments = selectedStatus.comments.map((dbComment) => {
      return dbComment.id === comment.id
        ? !isUserLikedComment
          ? {
              ...dbComment,
              likedPeople: dbComment.likedPeople.concat({
                displayName,
                email,
                photoURL,
                uid,
              }),
            }
          : {
              ...dbComment,
              likedPeople: reject(dbComment.likedPeople, {
                displayName,
                email,
                photoURL,
                uid,
              }),
            }
        : dbComment;
    });

    updateDocument("statuses", selectedStatus.id, {
      comments: newComments,
    });
  };

  return (
    <div className="d-flex flex-column">
      {statuses.map((status) => (
        <Status
          key={status.id}
          status={status}
          isUser={isUser}
          userDoc={userDoc}
          handleDeleteStatus={handleDeleteStatus}
          handleLikeStatus={handleLikeStatus}
          handleToggleCommentTab={handleToggleCommentTab}
          handleLikeComment={handleLikeComment}
          handleDeleteComment={handleDeleteComment}
          onPostComment={onPostComment}
        />
      ))}
    </div>
  );
};
export default Statuses;
