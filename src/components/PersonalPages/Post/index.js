import React from "react";
import { Modal } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PostCard from "./PostCard";

const Post = () => {
  const {
    userDoc,
    handleDeleteStatus,
    handleReactStatus,
    handleToggleCommentTab,
    handleDeleteComment,
    handleReactComment,
    statuses,
  } = useAppContext();

  const { postId } = useParams();

  const match = useRouteMatch();
  const history = useHistory();

  const status = statuses.find((status) => status.id === postId);

  if (!status) {
    return null;
  }

  const handleCloseStatusPhotoModal = () => {
    history.goBack();
  };

  const handleDeletePostCard = (status) => {
    handleDeleteStatus(status);
    history.goBack();
  };

  return (
    <Modal
      show={match}
      onHide={handleCloseStatusPhotoModal}
      fullscreen
      className="post-photo-modal"
    >
      <div style={{ maxWidth: 600, width: "100%" }}>
        <span
          className="closed-post-modal-icon"
          onClick={handleCloseStatusPhotoModal}
        >
          <FontAwesomeIcon icon={["fas", "times"]} />
        </span>

        <div className="post-photo-modal-wrapper">
          <PostCard
            status={status}
            userDoc={userDoc}
            onDeleteStatus={handleDeletePostCard}
            onReactStatus={(emoReact) => handleReactStatus(status, emoReact)}
            onToggleCommentTab={handleToggleCommentTab}
            onReactComment={handleReactComment}
            onDeleteComment={handleDeleteComment}
          />
        </div>
      </div>
    </Modal>
  );
};
export default Post;
