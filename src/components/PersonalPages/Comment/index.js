import React, { useState } from "react";
import { Col, Row, Tab, Tabs, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import Moment from "react-moment";
import { find, groupBy } from "lodash";
import UserAvatar from "../UserAvatar";
import { Image } from "antd";
import "./index.css";

export default function Comment({
  comment,
  onDeleteComment,
  userDoc,
  onReactComment,
  isStatusOfUser,
}) {
  const userReact = find(comment.people, { uid: userDoc?.uid });
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
  const isCommentOfUser = comment.uid === userDoc?.uid;
  const commentReacts = groupBy(comment.people, "react");

  const keys = Object.keys(commentReacts);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [tabKey, setTabKey] = useState(keys[0]);

  const renderCommentReacts = () => {
    const renderReacts = keys.map((key) => {
      const reacts = commentReacts[key];

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

              <span style={{ fontSize: 24 }}>{reacts.length}</span>
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
    });

    return renderReacts;
  };

  /* Not Yet */
  const handleEditComment = () => {};

  return (
    <Row className="py-3 mb-3 bg-white">
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <span className="closed-modal-button">
            <FontAwesomeIcon icon={["fas", "times"]} onClick={handleClose} />
          </span>
          <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k)}>
            {renderCommentReacts()}
          </Tabs>
        </Modal.Body>
      </Modal>

      <Col xs={10}>
        <UserAvatar
          email={comment.email}
          photoURL={comment.photoURL}
          width="50px"
          height="50px"
          float="left"
          textSize="25px"
        >
          {comment.displayName?.charAt(0)}
        </UserAvatar>

        <div style={{ paddingLeft: "60px" }}>
          <div className="comment-section" style={{ position: "relative" }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {comment.displayName}
            </div>

            <div style={{ fontSize: "18px" }}>{comment.content}</div>

            <div>
              {comment.attachments?.length >= 2 && (
                <Row className="m-1 d-flex">
                  <Image.PreviewGroup>
                    {comment.attachments.map((img) => (
                      <Col
                        key={img}
                        xs={6}
                        md={4}
                        className="p-2 flex-grow-1 comment-image-wrapper"
                      >
                        <Image src={img} alt="comment-upload" />
                      </Col>
                    ))}
                  </Image.PreviewGroup>
                </Row>
              )}

              {comment.attachments?.length === 1 && (
                <div className="m-1 p-2">
                  <Image src={comment.attachments[0]} alt="comment-upload" />
                </div>
              )}
            </div>

            {comment.people.length > 0 && (
              <div
                className="d-flex align-items-end my-2 comment-react"
                onClick={handleShow}
                style={{ cursor: "pointer" }}
              >
                <div style={{ cursor: "pointer" }}>
                  <div className="me-1">
                    {keys.map((key) => {
                      return (
                        <span key={key}>
                          {key === "thumbs-up" ? (
                            <FontAwesomeIcon
                              icon={["fas", "thumbs-up"]}
                              className="status-liked"
                              style={{
                                padding: 5,
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
                              style={{ opacity: 1, fontSize: 18 }}
                            />
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <Tooltip
                  placement="bottom"
                  title={comment.people.map((person) => (
                    <div key={person.uid}>{person.displayName}</div>
                  ))}
                >
                  <span style={{ fontSize: 16 }}>{comment.people.length}</span>
                </Tooltip>
              </div>
            )}
          </div>

          <div className="d-flex ms-2 mt-1">
            <Tooltip
              title={
                <div>
                  <FontAwesomeIcon
                    icon={["far", "grin-hearts"]}
                    className="me-1 emoji-react"
                    onClick={() => {
                      onReactComment("grin-hearts");
                      setTabKey("grin-hearts");
                    }}
                  />
                  <FontAwesomeIcon
                    icon={["far", "flushed"]}
                    className="me-1 emoji-react"
                    onClick={() => {
                      onReactComment("flushed");
                      setTabKey("flushed");
                    }}
                  />
                  <FontAwesomeIcon
                    icon={["far", "angry"]}
                    className="me-1 emoji-react"
                    onClick={() => {
                      onReactComment("angry");
                      setTabKey("angry");
                    }}
                  />

                  <FontAwesomeIcon
                    icon={["far", "grin-beam-sweat"]}
                    className="me-1 emoji-react"
                    onClick={() => {
                      onReactComment("grin-beam-sweat");
                      setTabKey("grin-beam-sweat");
                    }}
                  />

                  <FontAwesomeIcon
                    icon={["far", "grin-squint-tears"]}
                    className="me-1 emoji-react"
                    onClick={() => {
                      onReactComment("grin-squint-tears");
                      setTabKey("grin-squint-tears");
                    }}
                  />
                </div>
              }
              placement="top"
              mouseLeaveDelay={0.2}
              color="white"
            >
              <div
                className="me-3"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  onReactComment("thumbs-up");
                  setTabKey("thumbs-up");
                }}
              >
                {userReact ? (
                  <div>
                    <span>
                      {userReact?.react === "thumbs-up" ? (
                        <FontAwesomeIcon
                          icon={["fas", "thumbs-up"]}
                          className="status-liked me-1"
                          style={{
                            padding: 4,
                            color: "#fff",
                            background: "#0d6efd",
                            borderRadius: "50%",
                            width: 18,
                            height: 18,
                          }}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={["far", userReact.react]}
                          className="status-react me-1"
                          style={{ opacity: 1, fontSize: 16 }}
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
            </Tooltip>

            <span
              style={{
                fontStyle: "italic",
              }}
            >
              <Moment fromNow unix>
                {comment.commentedAt.seconds}
              </Moment>
            </span>
          </div>
        </div>
      </Col>

      <Col xs={2}>
        {(isStatusOfUser || isCommentOfUser) && (
          <Tooltip
            placement="bottomRight"
            title={
              <span style={{ cursor: "pointer", color: "#000", fontSize: 16 }}>
                <Row
                  onClick={onDeleteComment}
                  className="status-action m-1 p-1"
                >
                  <Col xs={3}>
                    <FontAwesomeIcon icon={["far", "trash-alt"]} />
                  </Col>
                  <Col xs>
                    <span>Delete comment</span>
                  </Col>
                </Row>

                <Row
                  onClick={handleEditComment}
                  className="status-action m-1 p-1"
                >
                  <Col xs={3}>
                    <FontAwesomeIcon icon={["far", "edit"]} />
                  </Col>

                  <Col xs>
                    <span>Edit comment</span>
                  </Col>
                </Row>
              </span>
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
  );
}
