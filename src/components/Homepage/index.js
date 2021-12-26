import React from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import ChatWindow from "../ChatWindow";
import Status from "../PersonalPages/Status";
import useFirestore from "../hooks/useFirestore";
import { orderBy } from "lodash";

export default function Homepage({
  isUser,
  handleDeleteStatus,
  handleLikeStatus,
  handleToggleCommentForm,
  handleLikeComment,
  handleDeleteComment,
  onPostComment,
  handleCloseCommentForm,
}) {
  const { users } = useAppContext();
  const statuses = useFirestore("statuses", "");

  return (
    <Row>
      <Col sm={10}>
        {users.map((user) => {
          const userStatuses = statuses.filter(
            (status) => status.uid === user.uid
          );
          const orderedUsereStatuses = orderBy(
            userStatuses,
            ["createdAt"],
            "desc"
          );

          return (
            <Status
              userProfile={user}
              key={user.email}
              statuses={orderedUsereStatuses}
              isUser={isUser}
              handleDeleteStatus={handleDeleteStatus}
              handleLikeStatus={handleLikeStatus}
              handleToggleCommentForm={handleToggleCommentForm}
              handleLikeComment={handleLikeComment}
              handleDeleteComment={handleDeleteComment}
              onPostComment={onPostComment}
              handleCloseCommentForm={handleCloseCommentForm}
            />
          );
        })}
      </Col>
      <Col sm className="d-none d-sm-block">
        <ChatWindow />
      </Col>
    </Row>
  );
}
