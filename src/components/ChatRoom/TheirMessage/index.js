import React from "react";

import { formatRelative } from "date-fns";
import { Avatar, Tooltip } from "antd";

const formatDate = (seconds) => {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
};

export default function TheirMessage({
  content,
  displayName,
  createdAt,
  photoURL,
  lastMessage,
  uid,
}) {
  const isFirstMessageByUser = !lastMessage || lastMessage?.uid !== uid;

  return (
    <div className="mb-1">
      {isFirstMessageByUser && (
        <Tooltip placement="left" title={displayName}>
          <Avatar
            size={45}
            src={photoURL}
            style={{
              backgroundColor: "pink",
              fontSize: "30px",
              float: "left",
              fontWeight: "600",
            }}
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
        placement="right"
      >
        <div
          className="message-content d-flex align-items-center"
          style={{ marginLeft: "45px", width: "max-content" }}
        >
          <div
            style={{
              backgroundColor: "pink",
              borderRadius: "5px ",
              boxShadow: "5px 5px 5px 0 grey",
              padding: "10px",
              margin: "0 10px",
            }}
          >
            <span>{content}</span>
          </div>
        </div>
      </Tooltip>
    </div>
  );
}
