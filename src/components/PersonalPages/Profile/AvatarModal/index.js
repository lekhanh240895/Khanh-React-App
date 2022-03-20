import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Image, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useAppContext } from "../../../../contexts/AppContext";

export default function AvatarModal({ user, isUser }) {
  const [showAvatar, setShowAvatar] = useState(false);
  const handleShowAvatar = () => setShowAvatar(true);
  const handleClose = () => setShowAvatar(false);
  const { setShowUploadAvatarModal } = useAppContext();

  return (
    <div className="mb-3">
      <Modal show={showAvatar} onHide={handleClose} fullscreen>
        <Image
          fluid
          src={user.photoURL}
          style={{ width: "100%", height: "100%" }}
        />
        <span className="closed-react-modal-button">
          <FontAwesomeIcon icon={["fas", "times"]} onClick={handleClose} />
        </span>
      </Modal>

      {user.photoURL ? (
        <div style={{ position: "relative", height: "200px", width: "200px" }}>
          <div>
            <Image
              variant="top"
              src={user.photoURL}
              alt="Avatar"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
              onClick={handleShowAvatar}
            />
          </div>

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
        </div>
      ) : (
        <div
          style={{
            position: "relative",
            width: "200px",
            height: "200px",
            border: "1px solid #0B3D6B",
            borderRadius: "50%",
            background: "pink",
          }}
          className="text-white d-flex justify-content-center align-items-center"
        >
          <span style={{ fontSize: "100px", fontWeight: "600" }}>
            {user.displayName?.charAt(0)}
          </span>

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
                  color: "#000",
                  fontSize: "24px",
                }}
                onClick={() => setShowUploadAvatarModal(true)}
              >
                <FontAwesomeIcon icon={["fas", "camera"]} />
              </div>
            </OverlayTrigger>
          )}
        </div>
      )}
    </div>
  );
}
