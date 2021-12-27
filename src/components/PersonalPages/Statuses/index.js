import { v1 as uuidv1 } from "uuid";
import { find, findIndex, reject } from "lodash";
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
    const { displayName, photoURL } = userDoc;

    if (isUser) {
      if (!selectedStatus.isLikedByUser) {
        updateDocument("statuses", selectedStatus.id, {
          isLikedByUser: !status.isLikedByUser,
          likedPeople: selectedStatus.likedPeople.concat({
            displayName,
            photoURL,
          }),
        });
      } else {
        updateDocument("statuses", selectedStatus.id, {
          isLikedByUser: !status.isLikedByUser,
          likedPeople: reject(selectedStatus.likedPeople, {
            displayName,
            photoURL,
          }),
        });
      }
    } else {
      if (!selectedStatus.isLiked) {
        updateDocument("statuses", selectedStatus.id, {
          isLiked: !status.isLiked,
          likedPeople: selectedStatus.likedPeople.concat({
            displayName,
            photoURL,
          }),
        });
      } else {
        updateDocument("statuses", selectedStatus.id, {
          isLiked: !status.isLiked,
          likedPeople: reject(selectedStatus.likedPeople, {
            displayName,
            photoURL,
          }),
        });
      }
    }
  };

  //Comment
  const handleToggleCommentForm = (status) => {
    const selectedStatus = find(statuses, { id: status.id });

    updateDocument("statuses", selectedStatus.id, {
      isCommentFormOpened: !status.isCommentFormOpened,
    });
  };

  const handleCloseCommentForm = (status) => {
    const selectedStatus = find(statuses, { id: status.id });

    updateDocument("statuses", selectedStatus.id, {
      isCommentFormOpened: false,
    });
  };

  const onPostComment = async (data, status) => {
    const selectedStatus = find(statuses, { id: status.id });

    await updateDocument("statuses", selectedStatus.id, {
      comments: selectedStatus.comments.concat({
        content: data.comment,
        commentedAt: new Date(),
        id: uuidv1(),
        isLiked: false,
        commentUserProfile: userDoc,
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

    const selectedCommentIndex = findIndex(status.comments, { id: comment.id });

    const newComments = [];

    status.comments.forEach((dbComment) => {
      newComments.push({
        content: dbComment.content,
        commentedAt: dbComment.commentedAt,
        id: dbComment.id,
        isLiked: dbComment.isLiked,
        commentUserProfile: dbComment.commentUserProfile,
      });
    });

    newComments[selectedCommentIndex].isLiked = !comment.isLiked;

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
          handleToggleCommentForm={handleToggleCommentForm}
          handleLikeComment={handleLikeComment}
          handleDeleteComment={handleDeleteComment}
          onPostComment={onPostComment}
          handleCloseCommentForm={handleCloseCommentForm}
        />
      ))}
    </div>
  );
};
export default Statuses;
