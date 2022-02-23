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

export default function MyMessage({
  content,
  displayName,
  createdAt,
  photoURL,
  onDeleteMessage,
  lastMessage,
  uid,
}) {
  const isFirstMessageByUser = !lastMessage || lastMessage?.uid !== uid;

  return (
    <div className="mb-1 d-flex align-items-center flex-row-reverse">
      {isFirstMessageByUser && (
        <Tooltip placement="right" title={displayName}>
          <Avatar
            size={45}
            src={photoURL}
            style={{
              backgroundColor: "pink",
              fontSize: "30px",
              float: "left",
              marginLeft: "-45px",
              fontWeight: "600"
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
        placement="left"
      >
        <div
          className="message-content d-flex flex-row-reverse align-items-center"
          style={{ marginRight: "45px" }}
        >
          <div
            style={{
              backgroundColor: "pink",
              borderRadius: "5px",
              boxShadow: "5px 5px 5px 0 grey",
              padding: "10px",
              margin: "0 10px",
            }}
          >
            <span>{content}</span>
          </div>

          <span onClick={onDeleteMessage} className="message-edit">
            <FontAwesomeIcon icon={["far", "trash-alt"]} />
          </span>
        </div>
      </Tooltip>
    </div>
  );
}
