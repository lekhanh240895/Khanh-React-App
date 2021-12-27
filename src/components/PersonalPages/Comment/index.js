import React from "react";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Moment from "react-moment";
import { Link } from "react-router-dom";

export default function Comment({
  comment,
  onLikeComment,
  isUser,
  onDeleteComment,
}) {
  return (
    <div className="p-3 mb-3 bg-white d-flex justify-content-between">
      <div className="flex-fill" style={{ lineHeight: "0.7" }}>
        <Link to={`/${comment.commentUserProfile?.email}`}>
          <Image
            className="float-start"
            src={comment.commentUserProfile?.photoURL}
            alt="Avatar"
            style={{
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              marginRight: "10px",
            }}
          />
        </Link>

        <h5>{comment.commentUserProfile.displayName}</h5>

        <p>{comment.content}</p>

        <p style={{ paddingLeft: "50px" }}>
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
        </p>
      </div>

      {isUser && (
        <span
          onClick={() => onDeleteComment(comment)}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={["far", "trash-alt"]} />
        </span>
      )}
    </div>
  );
}
