import React from "react";
import UserAvatar from "../../PersonalPages/UserAvatar/index";
import { useAppContext } from "../../../contexts/AppContext";

export default function UserInfo() {
  const { userDoc } = useAppContext();
  return (
    <div className="d-flex align-items-center">
      <UserAvatar
        email={userDoc?.email}
        photoURL={userDoc?.photoURL}
        width="60px"
        height="60px"
        textSize="40px"
      >
        {userDoc?.displayName?.charAt(0)}
      </UserAvatar>
      <span className="mx-2" style={{ fontSize: "24px" }}>
        {userDoc?.displayName}
      </span>
    </div>
  );
}
