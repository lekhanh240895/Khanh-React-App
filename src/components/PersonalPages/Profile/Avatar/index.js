import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppContext } from "../../../../contexts/AppContext";
import { Image } from "antd";
import "./index.css";

export default function Avatar({ user, isUser }) {
  const { setShowUploadAvatarModal } = useAppContext();
  return (
    <div className="mb-3">
      {isUser && (
        <OverlayTrigger
          placement="right-start"
          overlay={
            <Tooltip>
              <span>Change Avatar</span>
            </Tooltip>
          }
        >
          <div
            style={{
              position: "absolute",
              bottom: "-5px",
              right: "-5px",
              cursor: "pointer",
              fontSize: "24px",
            }}
            onClick={() => setShowUploadAvatarModal(true)}
          >
            <FontAwesomeIcon icon={["fas", "camera"]} />
          </div>
        </OverlayTrigger>
      )}

      {user.photoURL ? (
        <div className="avatar-wrapper">
          <Image src={user.photoURL} alt="Avatar" />
        </div>
      ) : (
        <div className="avatar-wrapper avatar-wrapper-text">
          <span style={{ fontSize: "100px", fontWeight: "600" }}>
            {user.displayName?.charAt(0)}
          </span>
        </div>
      )}
    </div>
  );
}
