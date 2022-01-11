import React from "react";
import { Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Moment from "react-moment";

import { some } from "lodash";
import UserAvatar from "../UserAvatar";

export default function Comment({
  comment,
  onLikeComment,
  isUser,
  onDeleteComment,
  userDoc,
}) {
  const isCommentOfUser = comment.uid === userDoc?.uid;
  const isUserLikedComment = some(comment.likedPeople, { uid: userDoc?.uid });
  const likedCommentList = comment.likedPeople.map(
    (person) => person.displayName
  );

  return (
    <Row className="p-3 pb-0 mb-3 bg-white">
      <Col xs={11} style={{ lineHeight: "0.5" }}>
        <div style={{ marginLeft: "-10px" }}>
          <UserAvatar
            email={comment.email}
            photoURL={comment.photoURL}
            width="40px"
            height="40px"
            float="left"
            textSize="25px"
          >
            {comment.displayName?.charAt(0)}
          </UserAvatar>
        </div>

        <h5
          style={{
            paddingLeft: "50px",
          }}
        >
          {comment.displayName}
        </h5>

        <p
          style={{
            paddingLeft: "50px",
            lineHeight: "1.5",
            margin: "-5px 0 5px 0",
          }}
        >
          {comment.content}
        </p>

        <p style={{ paddingLeft: "50px" }}>
          <span
            onClick={() => onLikeComment(comment)}
            style={{ cursor: "pointer" }}
            className={comment.isLiked ? "comment-liked" : ""}
          >
            <FontAwesomeIcon
              icon={
                isUserLikedComment ? ["fas", "thumbs-up"] : ["far", "thumbs-up"]
              }
              className={isUserLikedComment ? " comment-liked" : ""}
              size="sm"
            />
          </span>

          <span
            style={{
              margin: "0 0.5rem",
              fontSize: "0.5rem",
            }}
          >
            <FontAwesomeIcon icon={["far", "circle"]} />
          </span>

          <span
            style={{
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            {comment.likedPeople.length > 0 && (
              <span>{likedCommentList.join(", ")} liked this.</span>
            )}
          </span>
        </p>

        <p
          style={{
            fontSize: "14px",
            fontStyle: "italic",
            paddingLeft: " 50px",
          }}
        >
          <Moment fromNow unix>
            {comment.commentedAt.seconds}
          </Moment>
        </p>
      </Col>

      <Col xs={1}>
        {(isUser || isCommentOfUser) && (
          <span
            onClick={() => onDeleteComment(comment)}
            style={{ cursor: "pointer" }}
          >
            <FontAwesomeIcon icon={["far", "trash-alt"]} />
          </span>
        )}
      </Col>
    </Row>
  );
}
