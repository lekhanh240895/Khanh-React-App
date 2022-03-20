import React from "react";
import { Modal } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";
import {
  useParams,
  useHistory,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import "./index.css";
import Status from "../Status";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Post = () => {
  const {
    userDoc,
    handleDeleteStatus,
    handleReactStatus,
    handleToggleCommentTab,
    handleDeleteComment,
    handleReactComment,
    statuses,
    setPostModalShow,
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
    setPostModalShow(false);
  };

  return (
    <Modal
      show={match}
      onHide={handleCloseStatusPhotoModal}
      fullscreen
      className="post-photo-modal"
    >
      <div style={{ maxWidth: 1000 }}>
        <span
          className="closed-photo-modal-icon"
          onClick={handleCloseStatusPhotoModal}
        >
          <FontAwesomeIcon icon={["fas", "times"]} />
        </span>

        <div className="post-photo-modal-wrapper">
          <Status
            status={status}
            userDoc={userDoc}
            onDeleteStatus={handleDeleteStatus}
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