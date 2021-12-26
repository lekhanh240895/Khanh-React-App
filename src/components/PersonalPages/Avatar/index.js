import React from "react";
import { Link } from "react-router-dom";

export default function Avatar({ userProfile }) {
  return (
    <Link to={`/${userProfile?.email}`}>
      <img
        src={userProfile?.photoURL}
        alt="Avatar"
        style={{
          borderRadius: "50%",
          width: "40px",
          height: "40px",
        }}
      />
    </Link>
  );
}
