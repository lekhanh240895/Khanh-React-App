import React from "react";

export default function Avatar({user}) {
  return (
    <img
      src={user?.photoURL}
      alt="Avatar"
      style={{
        borderRadius: "50%",
        width: "40px",
        height: "40px",
      }}
    />
  );
}
