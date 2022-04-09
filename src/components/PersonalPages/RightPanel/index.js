import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import React from "react";
import { useAppContext } from "../../../contexts/AppContext";
import "./index.css";

export default function RightPanel() {
  const { users } = useAppContext();

  const onlineUsers = users.filter((user) => user.isOnline);
  const offlineUsers = users.filter((user) => !user.isOnline);

  return (
    <div className="right-panel-wrapper">
      <div className="right-panel-wrapper_header mb-3">
        <span>Contact users</span>
        <span
          style={{
            backgroundColor: "#F0F2F5",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
          className="d-flex justify-content-center align-items-center"
        >
          <FontAwesomeIcon
            icon={["fas", "search"]}
            style={{
              color: "rgba(0, 0, 0, 0.4)",
              fontSize: "16px",
            }}
          />
        </span>
      </div>

      <div className="right-panel-wrapper_body">
        {onlineUsers.map((user) => (
          <div
            className=" d-flex align-items-center mb-3"
            style={{ position: "relative" }}
            key={user.uid}
          >
            <Avatar
              src={user.photoURL}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "pink",
                fontSize: "25px",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              {user.displayName?.charAt(0)}
            </Avatar>

            <span
              style={{
                position: "absolute",
                top: 35,
                left: 37,
              }}
            >
              <FontAwesomeIcon
                icon={["fas", "circle"]}
                style={{ width: 15, height: 15, color: "#00c900" }}
              />
            </span>

            <h5 style={{ padding: "0 10px", fontSize: 18 }}>
              {user.displayName}
            </h5>
          </div>
        ))}

        {offlineUsers.map((user) => (
          <div
            className="d-flex align-items-center mb-3"
            style={{ position: "relative" }}
            key={user.uid}
          >
            <Avatar
              src={user.photoURL}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "pink",
                fontSize: "25px",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              {user.displayName?.charAt(0)}
            </Avatar>

            <h5 style={{ padding: "0 10px", fontSize: 18 }}>
              {user.displayName}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}
