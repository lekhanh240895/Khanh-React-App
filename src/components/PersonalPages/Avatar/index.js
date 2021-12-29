import React from "react";
import { Image } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Avatar({ userProfile }) {
  return (
    <Link to={`/${userProfile?.email}`} style={{ textDecoration: "none" }}>
      {userProfile?.photoURL ? (
        <Image
          src={userProfile?.photoURL}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
        />
      ) : (
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "pink",
          }}
          className="text-white d-flex justify-content-center align-items-center"
        >
          <span style={{ fontSize: "20px", fontWeight: "600" }}>
            {userProfile?.displayName?.charAt(0)}
          </span>
        </div>
      )}
    </Link>
  );
}
