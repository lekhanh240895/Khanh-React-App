import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

const UserAvatar = ({
  email,
  photoURL,
  children,
  width,
  height,
  float,
  textSize,
}) => {
  return (
    <Link to={`/${email}`} style={{ textDecoration: "none" }}>
      {photoURL ? (
        <Image
          src={photoURL}
          style={{
            float: float,
            width: width,
            height: height,
            borderRadius: "50%",
          }}
          alt="avatar"
        />
      ) : (
        <div
          style={{
            float: float,
            width: width,
            height: height,
            borderRadius: "50%",
            background: "pink",
          }}
          className="text-white d-flex justify-content-center align-items-center"
        >
          <span style={{ fontSize: textSize, fontWeight: "600" }}>
            {children}
          </span>
        </div>
      )}
    </Link>
  );
};

export default UserAvatar;
