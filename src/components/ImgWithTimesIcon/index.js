import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "react-bootstrap";

export default function ImgWithTimesIcon({ onClickTimesIcon, imgUrl }) {
  return (
    <div
      style={{ position: "relative" }}
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <div
        style={{
          position: "absolute",
          top: "1.25rem",
          right: "0.75rem",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon
          className="closed-icon"
          icon={["fas", "times"]}
          size="lg"
          onClick={onClickTimesIcon}
        />
      </div>

      <div>
        <Image
          variant="top"
          src={imgUrl}
          alt="Avatar"
          className="my-3"
          fluid
          style={{
            borderRadius: "10px",
            width: "500px",
          }}
        />
      </div>
    </div>
  );
}
