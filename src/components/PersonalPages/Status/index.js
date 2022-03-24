import { Card, Row, Col } from "react-bootstrap";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import Comment from "../Comment";
import { groupBy } from "lodash";
import PostCommentForm from "../PostCommentForm";
import UserAvatar from "../UserAvatar";
import { Tooltip } from "antd";
import { useState } from "react";
import { Modal, Tabs, Tab, Image } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";
import "./index.css";
import { Link, useLocation } from "react-router-dom";

const Status = ({
  status,
  onDeleteStatus,
  onToggleCommentTab,
  onReactComment,
  onDeleteComment,
  onReactStatus,
}) => {
  const { setSelectedStatusId, setPhotoIndex, userDoc, setScrollPosition } =
    useAppContext();

  const isStatusOfUser =
    status.postUid === userDoc?.uid || status.uid === userDoc?.uid;

  const likedStatusList = status.people?.map((person) => {
    return person.displayName === userDoc?.displayName
      ? "You"
      : person.displayName;
  });

  const userReact = status.people.find((person) => person.uid === userDoc?.uid);

  const statusReacts = React.useMemo(
    () => groupBy(status.people, "react"),
    [status.people]
  );
  const reactKeys = Object.keys(statusReacts);
  const [tabKey, setTabKey] = useState(reactKeys[0]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleShowPhoto = (index) => {
    setSelectedStatusId(status.id);
    setPhotoIndex(index);
    setScrollPosition(window.scrollY);
  };

  const getReactName = (react) => {
    switch (react) {
      case "flushed":
        return "Shock";
      case "thumbs-up":
        return "Like";
      case "grin-hearts":
        return "Love";
      case "angry":
        return "Angry";
      case "grin-beam-sweat":
        return "Confuse";
      case "grin-squint-tears":
        return "Haha";
      default:
    }
  };

  /* Not Yet */
  const handleEditStatus = () => {};

  const location = useLocation();
  return (
    <Card className="mb-3">
      {/* StatusReactModal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <span className="closed-react-modal-button">
            <FontAwesomeIcon icon={["fas", "times"]} onClick={handleClose} />
          </span>
          <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
            {reactKeys.map((key) => {
              const reacts = statusReacts[key];

              return (
                <Tab
                  key={key}
                  eventKey={key}
                  title={
                    <div
                      style={{ fontSize: "24px" }}
                      className="d-flex align-items-center"
                    >
                      <span className="me-2 my-auto">
                        {key === "thumbs-up" ? (
                          <FontAwesomeIcon
                            icon={["fas", "thumbs-up"]}
                            style={{
                              padding: "10px",
                              color: "#fff",
                              background: "#0d6efd",
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={["far", key]}
                            className="emoji-react"
                            style={{ opacity: 1 }}
                          />
                        )}
                      </span>

                      <span>{reacts.length}</span>
                    </div>
                  }
                >
                  {reacts.map((react) => (
                    <div
                      className="mt-4 mb-5"
                      style={{ position: "relative" }}
                      key={react.uid}
                    >
                      <UserAvatar
                        float="left"
                        email={react.email}
                        photoURL={react.photoURL}
                        width="50px"
                        height="50px"
                        textSize="25px"
                      >
                        {react.displayName?.charAt(0)}
                      </UserAvatar>

                      <span style={{ position: "absolute", top: 35, left: 35 }}>
                        {react.react === "thumbs-up" ? (
                          <FontAwesomeIcon
                            icon={["fas", "thumbs-up"]}
                            style={{
                              padding: "5px",
                              color: "#fff",
                              background: "#0d6efd",
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={["far", key]}
                            className="emoji-react"
                            style={{ opacity: 1, fontSize: 20 }}
                          />
                        )}
                      </span>

                      <h5 style={{ paddingLeft: "60px", fontSize: 24 }}>
                        {react.displayName}
                      </h5>
                    </div>
                  ))}
                </Tab>
              );
            })}
          </Tabs>
        </Modal.Body>
      </Modal>

      {/* StatusHeader */}
      <Card.Header>
        <Row className="my-2">
          <Col
            xs={10}
            md={11}
            style={{ lineHeight: 0.5 }}
            className="d-flex flex-column flex-md-row align-items-md-center"
          >
            <div>
              <UserAvatar
                float="left"
                email={status.postEmail}
                photoURL={status.postPhotoURL}
                width="50px"
                height="50px"
                textSize="30px"
              >
                {status.postDisplayName?.charAt(0)}
              </UserAvatar>

              <h4
                style={{ paddingLeft: "60px", fontWeight: 600, fontSize: 22 }}
              >
                {status.postDisplayName}
              </h4>

              <div
                style={{
                  fontSize: "14px",
                  fontStyle: "italic",
                  paddingLeft: "60px",
                }}
              >
                <Link
                  to={{
                    pathname: `${status.postEmail}/posts/${status.id}`,
                    state: { from: location.pathname },
                  }}
                  style={{ color: "#000" }}
                >
                  <Moment fromNow unix>
                    {status.createdAt?.seconds}
                  </Moment>
                </Link>
              </div>
            </div>

            {status.postUid !== status.uid && (
              <>
                <div>
                  <FontAwesomeIcon
                    icon={["fas", "arrow-down"]}
                    className="d-md-none"
                    style={{
                      fontSize: "20px",
                      margin: "10px 15px",
                    }}
                  />
                  <FontAwesomeIcon
                    icon={["fas", "arrow-right"]}
                    className="d-none d-md-block"
                    style={{
                      fontSize: "20px",
                      margin: "0 10px",
                    }}
                  />
                </div>

                <div>
                  <UserAvatar
                    float="left"
                    email={status.email}
                    photoURL={status.photoURL}
                    width="50px"
                    height="50px"
                    textSize="30px"
                  >
                    {status.displayName?.charAt(0)}
                  </UserAvatar>

                  <h4
                    style={{
                      paddingLeft: "60px",
                      fontWeight: 600,
                      fontSize: 22,
                    }}
                  >
                    {status.displayName}
                  </h4>
                </div>
              </>
            )}
          </Col>

          <Col xs={2} md={1}>
            {isStatusOfUser && (
              <Tooltip
                placement="bottomRight"
                title={
                  <div
                    style={{
                      cursor: "pointer",
                      color: "#000",
                      fontSize: 16,
                    }}
                  >
                    <Row
                      onClick={() => onDeleteStatus(status)}
                      className="status-action m-1 p-1"
                    >
                      <Col xs={3}>
                        <FontAwesomeIcon icon={["far", "trash-alt"]} />
                      </Col>
                      <Col xs>
                        <span>Delete post</span>
                      </Col>
                    </Row>

                    <Row
                      onClick={handleEditStatus}
                      className="status-action m-1 p-1"
                    >
                      <Col xs={3}>
                        <FontAwesomeIcon icon={["far", "edit"]} />
                      </Col>

                      <Col xs>
                        <span>Edit post</span>
                      </Col>
                    </Row>
                  </div>
                }
                trigger="click"
                color="#fff"
              >
                <span
                  style={{ cursor: "pointer", fontSize: 16 }}
                  className="status-option-icon"
                >
                  <FontAwesomeIcon icon={["fas", "ellipsis-h"]} />
                </span>
              </Tooltip>
            )}
          </Col>
        </Row>
      </Card.Header>

      {/* StatusBody */}
      <Card.Body>
        <div style={{ fontSize: "18px" }}>{status.content}</div>

        {status.attachments?.length >= 2 && (
          <Row className="m-1">
            {status.attachments.map((img, index) => (
              <Col key={img} xs={6} md={4} className="p-2 flex-grow-1">
                <div className="status-photo-wrapper">
                  <Link
                    to={{
                      pathname: `/photo/${status.id}`,
                      state: { from: location.pathname },
                    }}
                  >
                    <Image
                      fluid
                      src={img}
                      alt={"status-upload"}
                      rounded
                      onClick={() => handleShowPhoto(index)}
                    />
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {status.attachments?.length === 1 && (
          <div className="m-1 p-2 status-photo-wrapper">
            <Link
              to={{
                pathname: `/photo/${status.id}`,
                state: { from: location.pathname },
              }}
            >
              <Image
                fluid
                src={status.attachments[0]}
                alt={"status-upload"}
                rounded
                onClick={() => handleShowPhoto(null)}
              />
            </Link>
          </div>
        )}
      </Card.Body>

      {/* StatusFooter */}
      <Card.Footer>
        <Row className="text-center mb-2">
          {/* StatusReactWithTooltip */}
          <Tooltip
            title={
              /* ReactTooltip */
              <div>
                <FontAwesomeIcon
                  icon={["far", "grin-hearts"]}
                  className="me-1 emoji-react"
                  onClick={() => {
                    onReactStatus("grin-hearts");
                    setTabKey("grin-hearts");
                  }}
                />
                <FontAwesomeIcon
                  icon={["far", "flushed"]}
                  className="me-1 emoji-react"
                  onClick={() => {
                    onReactStatus("flushed");
                    setTabKey("flushed");
                  }}
                />
                <FontAwesomeIcon
                  icon={["far", "angry"]}
                  className="me-1 emoji-react"
                  onClick={() => {
                    onReactStatus("angry");
                    setTabKey("angry");
                  }}
                />

                <FontAwesomeIcon
                  icon={["far", "grin-beam-sweat"]}
                  className="me-1 emoji-react"
                  onClick={() => {
                    onReactStatus("grin-beam-sweat");
                    setTabKey("grin-beam-sweat");
                  }}
                />

                <FontAwesomeIcon
                  icon={["far", "grin-squint-tears"]}
                  className="me-1 emoji-react"
                  onClick={() => {
                    onReactStatus("grin-squint-tears");
                    setTabKey("grin-squint-tears");
                  }}
                />
              </div>
            }
            placement="top"
            mouseLeaveDelay={0.1}
            color="white"
          >
            <Col
              style={{ cursor: "pointer", height: "5vh" }}
              className="d-flex align-items-center justify-content-center"
              onClick={() => onReactStatus("thumbs-up")}
              id="status-react-wrapper"
            >
              <div style={{ fontSize: "18px" }}>
                {userReact ? (
                  <div>
                    <span className="me-1">
                      {userReact?.react === "thumbs-up" ? (
                        <FontAwesomeIcon
                          icon={["fas", "thumbs-up"]}
                          className="status-liked"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={["far", userReact.react]}
                          className="status-react"
                          style={{ opacity: 1 }}
                        />
                      )}
                    </span>
                    <span>{getReactName(userReact?.react)}</span>
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon
                      icon={["far", "thumbs-up"]}
                      className="me-1"
                    />
                    <span>Like</span>
                  </div>
                )}
              </div>
            </Col>
          </Tooltip>

          {/* Comment */}
          <Col
            onClick={() => onToggleCommentTab(status)}
            id="status-comment"
            style={{ cursor: "pointer", height: "5vh", fontSize: "18px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <span>
              <FontAwesomeIcon icon={["far", "comment-alt"]} className="me-2" />
            </span>
            <span>
              {!status.comments?.length
                ? "Comment"
                : status.comments?.length === 1
                ? `${status.comments?.length} Comment`
                : `${status.comments?.length} Comments`}
            </span>
          </Col>
        </Row>

        {status.people?.length > 0 && (
          <div className="mb-2 d-flex align-items-end">
            <div className="me-1">
              {reactKeys.map((key) => {
                return (
                  <span key={key}>
                    {key === "thumbs-up" ? (
                      <FontAwesomeIcon
                        icon={["fas", "thumbs-up"]}
                        className="status-liked"
                        style={{
                          padding: "5px",
                          color: "#fff",
                          background: "#0d6efd",
                          borderRadius: "50%",
                          width: 20,
                          height: 20,
                        }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={["far", key]}
                        className="status-react"
                        style={{ opacity: 1 }}
                      />
                    )}
                  </span>
                );
              })}
            </div>

            <Tooltip
              title={
                <div>
                  {status.people.map((person) => (
                    <div key={person.uid}>{person.displayName}</div>
                  ))}
                </div>
              }
              placement="bottom"
            >
              <span
                onClick={handleShow}
                style={{ cursor: "pointer", fontSize: 18 }}
              >
                <span className="d-sm-none mx-1">{status.people?.length}</span>

                <span className="d-none d-sm-block">
                  {status.people?.length > 4 ? (
                    <span className="mx-1">{status.people?.length}</span>
                  ) : (
                    <span>
                      <span>{likedStatusList.join(", ")}</span>
                      &nbsp;
                      <span>reacted this.</span>
                    </span>
                  )}
                </span>
              </span>
            </Tooltip>
          </div>
        )}

        {/* CommentSection */}
        <div
          style={{
            display: status.isCommentTabOpened ? "block" : "none",
          }}
        >
          {status.comments?.map((comment) => (
            <Comment
              isStatusOfUser={isStatusOfUser}
              key={comment.id}
              comment={comment}
              onDeleteComment={() => onDeleteComment(status, comment)}
              userDoc={userDoc}
              onReactComment={(emoReact) =>
                onReactComment(status, comment, emoReact)
              }
            />
          ))}

          <PostCommentForm status={status} />
        </div>
      </Card.Footer>
    </Card>
  );
};
export default Status;
