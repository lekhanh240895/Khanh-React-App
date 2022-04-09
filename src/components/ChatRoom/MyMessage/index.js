import React from "react";

import { formatRelative } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Tooltip } from "antd";
import "./index.css";
import { Image } from "antd";

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
  onReactMessage,
  lastMessage,
  uid,
  attachments,
  emoReact,
}) {
  const isFirstMessageByUser = !lastMessage || lastMessage?.uid !== uid;

  return (
    <div className="message mb-3 d-flex align-items-start flex-row-reverse">
      {isFirstMessageByUser && (
        <Tooltip placement="right" title={displayName} mouseLeaveDelay={0}>
          <Avatar
            size={45}
            src={photoURL}
            style={{
              backgroundColor: "pink",
              fontSize: "30px",
              float: "left",
              marginLeft: "-45px",
              fontWeight: "600",
            }}
            className="message-avatar"
          >
            {displayName.charAt(0)}
          </Avatar>
        </Tooltip>
      )}

      <div
        className="message_content d-flex flex-row-reverse align-items-center flex-wrap"
        style={{ marginRight: "45px" }}
      >
        {attachments?.length > 0 ? (
          <Image.PreviewGroup>
            {attachments.map((img) => (
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
            ))}
          </Image.PreviewGroup>
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
            placement="left"
            mouseLeaveDelay={0}
          >
            <div className="message_content_text message_content_text-myMessage">
              {content === "like" ? (
                <FontAwesomeIcon icon={["fas", "thumbs-up"]} />
              ) : (
                content
              )}

              {emoReact && (
                <div className="message-react-wrapper message-react-wrapper-text d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={["far", emoReact]}
                    style={{
                      fontSize: "20px",
                    }}
                    className="icon-react"
                  />
                </div>
              )}
            </div>
          </Tooltip>
        )}

        <span onClick={onDeleteMessage} className="message-edit">
          <FontAwesomeIcon icon={["far", "trash-alt"]} />
        </span>

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
