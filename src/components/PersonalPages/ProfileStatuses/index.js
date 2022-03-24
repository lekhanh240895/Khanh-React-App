import React from "react";
import { useAppContext } from "../../../contexts/AppContext";
import Status from "./Status";

const ProfileStatuses = ({ statuses }) => {
  const {
    handleDeleteStatus,
    handleReactStatus,
    handleToggleCommentTab,
    handleDeleteComment,
    handleReactComment,
  } = useAppContext();

  return (
    <div className="d-flex flex-column">
      {statuses.map((status) => (
        <Status
          key={status.id}
          status={status}
          onDeleteStatus={handleDeleteStatus}
          onReactStatus={(emoReact) => handleReactStatus(status, emoReact)}
          onToggleCommentTab={handleToggleCommentTab}
          onReactComment={handleReactComment}
          onDeleteComment={handleDeleteComment}
        />
      ))}
    </div>
  );
};
export default React.memo(ProfileStatuses);