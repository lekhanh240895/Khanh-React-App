import React from "react";

import { formatRelative } from "date-fns";
import { Avatar, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "antd";

const formatDate = (seconds) => {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate?.charAt(0).toUpperCase() + formattedDate.slice(1);
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
  attachments,
  onReactMessage,
  emoReact,
}) {
  const isFirstMessageByUser = !lastMessage || lastMessage?.uid !== uid;

  return (
    <div className="message mb-3">
      {isFirstMessageByUser && (
        <Tooltip placement="left" title={displayName} mouseLeaveDelay={0}>
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
            {displayName?.charAt(0)}
          </Avatar>
        </Tooltip>
      )}

      <div
        className="message_content d-flex align-items-center flex-wrap"
        style={{ marginLeft: "45px" }}
      >
        <Image.PreviewGroup>
          {attachments?.length > 0 ? (
            attachments.map((img) => (
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
                mouseLeaveDelay={0}
                key={img}
              >
                <div className="message_content_image">
                  <Image alt="pictureMessage" src={img} />

                  {emoReact && (
                    <span className="message-react-wrapper message-react-wrapper-image d-flex justify-content-center align-items-center">
                      <FontAwesomeIcon
                        icon={["far", emoReact]}
                        style={{
                          fontSize: "20px",
                        }}
                        className="icon-react"
                      />
                    </span>
                  )}
                </div>
              </Tooltip>
            ))
          ) : (
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
              mouseLeaveDelay={0}
            >
              <div className="message_content_text message_content_text-theirMessage">
                <div>
                  {content === "like" ? (
                    <FontAwesomeIcon
                      icon={["fas", "thumbs-up"]}
                      className="text-primary"
                    />
                  ) : (
                    <span style={{ color: "#000" }}>{content}</span>
                  )}
                </div>

                {emoReact && (
                  <span className="message-react-wrapper message-react-wrapper-text d-flex justify-content-center align-items-center">
                    <FontAwesomeIcon
                      icon={["far", emoReact]}
                      style={{
                        fontSize: "20px",
                        zIndex: 9,
                      }}
                      className="icon-react"
                    />
                  </span>
                )}
              </div>
            </Tooltip>
          )}
        </Image.PreviewGroup>

        <Tooltip
          title={
            <div>
              <FontAwesomeIcon
                icon={["far", "grin-hearts"]}
                className="me-1 icon-react"
                onClick={() => onReactMessage("grin-hearts")}
              />
              <FontAwesomeIcon
                icon={["far", "flushed"]}
                className="me-1 icon-react"
                onClick={() => onReactMessage("flushed")}
              />
              <FontAwesomeIcon
                icon={["far", "angry"]}
                className="me-1 icon-react"
                onClick={() => onReactMessage("angry")}
              />
              <FontAwesomeIcon
                icon={["far", "grin-beam-sweat"]}
                className="me-1 icon-react"
                onClick={() => onReactMessage("grin-beam-sweat")}
              />
              <FontAwesomeIcon
                icon={["far", "grin-squint-tears"]}
                className="icon-react"
                onClick={() => onReactMessage("grin-squint-tears")}
              />
            </div>
          }
          placement="top"
          mouseLeaveDelay={0.2}
          trigger="click"
          color="#fff"
        >
          <span className="message-edit">
            <FontAwesomeIcon icon={["far", "grin"]} size="lg" />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
