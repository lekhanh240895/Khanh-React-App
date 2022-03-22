import React from "react";
import { Image, Modal } from "react-bootstrap";
import {
  useParams,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import { Row, Col, Carousel } from "react-bootstrap";
import { storage } from "../../../firebase/config";
import StatusWithPhoto from "../StatusWithPhoto";
import "./index.css";

export default function Photo() {
  const { photoId } = useParams();
  const { statuses } = useAppContext();

  const status = statuses.find(({ id }) => id === photoId);

  const {
    userDoc,
    handleDeleteStatus,
    handleReactStatus,
    handleToggleCommentTab,
    handleDeleteComment,
    handleReactComment,
    photoIndex,
    setPhotoIndex,
    updateDocument,
  } = useAppContext();

  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  if (!status) return null;

  const handleCloseStatusPhotoModal = () => {
    if (location.state.from.includes("/posts")) {
      history.push("/");
    }

    history.push(location.state.from);
  };

  const isStatusOfUser =
    status.postUid === userDoc?.uid || status.uid === userDoc?.uid;

  const handleSelect = (selectedIndex, e) => {
    setPhotoIndex(selectedIndex);
  };

  const handleDeletePhoto = async () => {
    const photoUrl = status.attachments[photoIndex];
    const httpRef = ref(storage, photoUrl);
    await deleteObject(httpRef);
    const newAttachments = status.attachments.filter(
      (url) => url !== status.attachments[photoIndex]
    );

    updateDocument("statuses", status.id, {
      attachments: newAttachments,
    });

    if (photoIndex === status.attachments.length - 1) {
      setPhotoIndex(0);
    }
  };

  return (
    <Modal
      show={match}
      onHide={handleCloseStatusPhotoModal}
      fullscreen
      className="photo-modal"
    >
      <Row style={{ postion: "relative" }}>
        <span
          className="photo-modal-icon photo-modal-icon--close-icon"
          onClick={handleCloseStatusPhotoModal}
        >
          <FontAwesomeIcon icon={["fas", "times"]} />
        </span>

        <Col xs={12} md={8}>
          {status.attachments?.length > 1 && (
            <Carousel activeIndex={photoIndex} onSelect={handleSelect}>
              {status.attachments.map((url) => (
                <Carousel.Item key={url}>
                  <Image
                    fluid
                    src={url}
                    alt="Photos"
                    className="carousel-photo"
                    key={`photo-${url}`}
                    rounded
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          )}

          {status.attachments?.length === 1 && (
            <Image
              fluid
              src={status.attachments[0]}
              alt="Photos"
              className="carousel-photo"
              key={`photo-${status.attachments[0]}`}
              rounded
            />
          )}

          {isStatusOfUser && (
            <Tooltip
              placement="bottomRight"
              title={
                <div
                  style={{
                    cursor: "pointer",
                    color: "#000",
                    fontSize: 14,
                  }}
                >
                  <Row
                    onClick={handleDeletePhoto}
                    className="status-action m-0 p-1"
                  >
                    <Col xs={3}>
                      <FontAwesomeIcon icon={["far", "trash-alt"]} />
                    </Col>
                    <Col xs>
                      <span>Delete photo</span>
                    </Col>
                  </Row>
                </div>
              }
              trigger="click"
              color="#fff"
            >
              <span className="photo-modal-icon photo-modal-icon--option-icon">
                <FontAwesomeIcon icon={["fas", "ellipsis-h"]} />
              </span>
            </Tooltip>
          )}
        </Col>

        <Col xs={12} md={4} className="photo-status-modal-wrapper">
          <StatusWithPhoto
            status={status}
            userDoc={userDoc}
            onDeleteStatus={handleDeleteStatus}
            onReactStatus={(emoReact) => handleReactStatus(status, emoReact)}
            onToggleCommentTab={handleToggleCommentTab}
            onReactComment={handleReactComment}
            onDeleteComment={handleDeleteComment}
          />
        </Col>
      </Row>
    </Modal>
  );
}
