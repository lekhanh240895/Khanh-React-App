import React from "react";

import UserAvatar from "../../PersonalPages/UserAvatar";
import { formatRelative } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  email,
  onDeleteMessage
}) {
  return (
    <div>
      <UserAvatar
        float="left"
        photoURL={photoURL}
        email={email}
        width="40px"
        height="40px"
        textSize="25px"
      >
        {displayName?.charAt(0)}
      </UserAvatar>

      <div
        className="d-flex align-items-center justify-content-between"
        style={{ marginLeft: "50px", marginTop: "-5px" }}
      >
        <div>
          <span
            style={{
              fontSize: "20px",
              marginRight: "10px",
            }}
          >
            {displayName}
          </span>

          <span style={{ fontWeight: "500", fontStyle: "italic" }}>
            {formatDate(createdAt?.seconds)}
          </span>
        </div>

        <span style={{ cursor: "pointer" }} onClick={onDeleteMessage}>
          <FontAwesomeIcon icon={["far", "trash-alt"]} />
        </span>
      </div>

      <p
        style={{
          paddingLeft: "50px",
        }}
      >
        {content}
      </p>
    </div>
  );
}
