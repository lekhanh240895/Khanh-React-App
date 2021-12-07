import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../Avatar";
import Moment from "react-moment";

export default function Comment({
  comment,
  userProfile,
  onLikeComment,
  isUser,
  onDeleteComment,
}) {
  return (
    <Row key={comment.id} className="my-3 py-3 bg-white">
      <Col xs={1}>
        <Avatar user={userProfile} />
      </Col>

      <Col xs className="d-flex justify-content-between ms-3">
        <div style={{ lineHeight: "0.7" }}>
          <h5 style={{ fontSize: "14px", fontWeight: "600" }}>
            {userProfile.displayName}
          </h5>
          <p>{comment.content}</p>

          <div>
            <span
              onClick={() => onLikeComment(comment)}
              style={{ cursor: "pointer" }}
              className={comment.isLiked ? "comment-liked" : ""}
            >
              <FontAwesomeIcon
                icon={
                  comment.isLiked ? ["fas", "thumbs-up"] : ["far", "thumbs-up"]
                }
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
                fontStyle: "italic",
              }}
            >
              <Moment fromNow unix>
                {comment.commentedAt.seconds}
              </Moment>
            </span>
          </div>
        </div>

        {isUser && (
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
