import React from "react";

import { formatRelative } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Tooltip } from "antd";
import "./index.css";

const formatDate = (seconds) => {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
};

export default function Message({
  content,
  displayName,
  createdAt,
  photoURL,
  onDeleteMessage,
  userUid,
  uid,
  lastMessage,
}) {
  const isMyMessage = uid === userUid;
  const isFirstMessageByUser = !lastMessage || lastMessage.uid !== uid;
  console.log({ isFirstMessageByUser });
  return (
    <div
      className={
        isMyMessage
          ? "mb-1 d-flex flex-row-reverse align-items-center"
          : "mb-1 d-flex align-items-center"
      }
    >
      {isFirstMessageByUser && (
        <Tooltip placement="left" title={displayName}>
          <Avatar
            size={45}
            src={photoURL}
            style={{ backgroundColor: "pink", fontSize: "40px", float: "left" }}
          >
            {displayName.charAt(0)}
          </Avatar>
        </Tooltip>
      )}

      <Tooltip
        title={
          <span
            style={{
              fontWeight: "500",
              fontStyle: "italic",
            }}
          >
            {formatDate(createdAt?.seconds)}
          </span>
        }
        placement="top"
      >
        <div
          className={
            isMyMessage
              ? "message-content d-flex flex-row-reverse align-items-center"
              : "message-content d-flex align-items-center"
          }
        >
          <div
            style={{
              backgroundColor: "pink",
              borderRadius: "10px ",
              boxShadow: "5px 5px 5px 0 grey",
              padding: "10px",
              ...(isMyMessage ? { margin: "0 10px" } : { margin: "0 10px" }),
            }}
          >
            <span>{content}</span>
          </div>

          {isMyMessage && (
            <span onClick={onDeleteMessage} className="message-edit">
              <FontAwesomeIcon icon={["far", "trash-alt"]} />
            </span>
          )}
        </div>
      </Tooltip>
    </div>
  );
}
