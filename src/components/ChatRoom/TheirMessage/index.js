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
    <div className="mb-3">
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
        className="message-content d-flex align-items-center flex-wrap"
        style={{ marginLeft: "45px" }}
      >
        <Image.PreviewGroup>
          {attachments?.length > 0 ? (
            attachments.map((img) => (
              <div
                style={{
                  padding: "0 10px 5px 5px",
                  position: "relative",
                  fontSize: "18px",
                  maxWidth: "400px",
                  zIndex: 1,
                }}
                key={img}
              >
                <Image
                  alt="pictureMessage"
                  src={img}
                  style={{
                    height: "200px",
                    width: "200px",
                    borderRadius: "20px",
                  }}
                />

                {emoReact && (
                  <span
                    style={{
                      position: "absolute",
                      color: "#FF8804",
                      bottom: -10,
                      right: -5,
                      zIndex: 2,
                      backgroundColor: "#fff",
                      border: "1px solid gray",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                    }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <FontAwesomeIcon
                      icon={["far", emoReact]}
                      style={{
                        fontSize: "20px",
                      }}
                      className="emoji-react"
                    />
                  </span>
                )}
              </div>
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
              <div
                style={{
                  backgroundColor: "#0D6EFD",
                  color: "white",
                  borderRadius: "10px",
                  boxShadow: "5px 5px 5px 0 grey",
                  padding: "10px 15px",
                  margin: "0 10px",
                  fontSize: "18px",
                  position: "relative",
                  maxWidth: "400px",
                  zIndex: 1,
                }}
              >
                <div>
                  {content === "like" ? (
                    <FontAwesomeIcon icon={["fas", "thumbs-up"]} />
                  ) : (
                    content
                  )}
                </div>

                {emoReact && (
                  <span
                    style={{
                      position: "absolute",
                      color: "#FF8804",
                      bottom: -15,
                      right: -10,

                      backgroundColor: "#fff",
                      border: "1px solid gray",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                    }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <FontAwesomeIcon
                      icon={["far", emoReact]}
                      style={{
                        fontSize: "20px",
                        zIndex: 9,
                      }}
                      className="emoji-react"
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
                className="me-1 emoji-react"
                onClick={() => onReactMessage("grin-hearts")}
              />
              <FontAwesomeIcon
                icon={["far", "flushed"]}
                className="me-1 emoji-react"
                onClick={() => onReactMessage("flushed")}
              />
              <FontAwesomeIcon
                icon={["far", "angry"]}
                className="me-1 emoji-react"
                onClick={() => onReactMessage("angry")}
              />
              <FontAwesomeIcon
                icon={["far", "grin-beam-sweat"]}
                className="me-1 emoji-react"
                onClick={() => onReactMessage("grin-beam-sweat")}
              />
              <FontAwesomeIcon
                icon={["far", "grin-squint-tears"]}
                className="emoji-react"
                onClick={() => onReactMessage("grin-squint-tears")}
              />
            </div>
          }
          placement="top"
          mouseLeaveDelay={0.2}
          trigger="click"
          color="#fff"
        >
          <span className="message-edit emoji">
            <FontAwesomeIcon icon={["far", "grin"]} size="lg" />
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
