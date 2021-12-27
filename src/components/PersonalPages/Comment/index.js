import React from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../Avatar";
import Moment from "react-moment";

export default function Comment({
  comment,
  onLikeComment,
  isUser,
  onDeleteComment,
}) {
  return (
    <Row className="my-3 py-3 mx-1 bg-white">
      <Col xs={1} className="ps-2 ps-sm-3">
        <Avatar userProfile={comment.commentUserProfile} />
      </Col>

      <Col xs className="d-flex justify-content-between ms-3">
        <div>
          <h5 style={{ fontSize: "14px", fontWeight: "600" }}>
            {comment.commentUserProfile.displayName}
          </h5>

          <p style={{ marginTop: "-5px", marginBottom: "-2px" }}>
            {comment.content}
          </p>

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
