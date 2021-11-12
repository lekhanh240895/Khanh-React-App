import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Image, OverlayTrigger, Tooltip } from "react-bootstrap";


export default function Avatar({ onShowUploadModal }) {
  const { user } = useAuth();
  const [showAvatar, setShowAvatar] = useState(false);

  const handleShowAvatar = () => setShowAvatar(true);
  const handleClose = () => setShowAvatar(false);
  return (
    <>
      {user.photoURL ? (
        <div style={{ position: "relative" }}>
          <Image
            variant="top"
            src={user.photoURL}
            alt="Avatar"
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              cursor: "pointer",
            }}
            onClick={handleShowAvatar}
          />

          <OverlayTrigger
            placement="right-start"
            overlay={
              <Tooltip>
                <span>Change Avatar</span>
              </Tooltip>
            }
          >
            <span
              style={{
                position: "absolute",
                bottom: "-5px",
                right: "-5px",
                cursor: "pointer",
              }}
              onClick={onShowUploadModal}
            >
              <FontAwesomeIcon icon={["fas", "camera"]} />
            </span>
          </OverlayTrigger>

          <Modal show={showAvatar} onHide={handleClose} fullscreen>
            <Modal.Body>
              <Image fluid src={user.photoURL} />
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        <div
          style={{
            width: "100px",
            height: "100px",
            border: "1px solid #0B3D6B",
            borderRadius: "50%",
            background: "#0B3D6B",
          }}
          className="text-white d-flex justify-content-center align-items-center"
        >
          <span style={{ fontSize: "30px", fontWeight: "600" }}>
            {user.displayName?.charAt(0)}
          </span>
          <FontAwesomeIcon
            icon={["fas", "camera"]}
            style={{
              position: "absolute",
              bottom: "0",
              right: "0",
              cursor: "pointer",
            }}
            onClick={onShowUploadModal}
          />
        </div>
      )}
    </>
  );
}
