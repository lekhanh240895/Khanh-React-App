import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal, Button, Card } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import EditPostForm from "../PersonalPages/EditPostForm";

import { formatRelative } from "date-fns";
import Moment from "react-moment";
import { Tooltip } from "antd";
import UserAvatar from "../PersonalPages/UserAvatar";

const formatDate = (seconds) => {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
};

export default function EditPostModal() {
  const { showEditPost, setShowEditPost, selectedStatusId, statuses } =
    useAppContext();
  const childRef = React.useRef();

  const handleClose = () => setShowEditPost(false);

  const status = statuses.find((status) => status.id === selectedStatusId);

  const handleOk = () => {
    childRef.current.updatePost();
  };

  if (!status) return null;

  return (
    <Modal show={showEditPost} onHide={handleClose}>
      <Modal.Header>
        <div className="text-center w-100">
          <h4>Edit post</h4>
          <span className="closed-react-modal-button">
            <FontAwesomeIcon icon={["fas", "times"]} onClick={handleClose} />
          </span>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Card className="mb-3">
          {/* StatusHeader */}
          <Card.Header style={{ lineHeight: 0.5 }}>
            <div className="my-2 d-flex flex-column flex-md-row align-items-md-center">
              <div>
                <UserAvatar
                  float="left"
                  email={status.postEmail}
                  photoURL={status.postPhotoURL}
                  width="50px"
                  height="50px"
                  textSize="30px"
                >
                  {status.postDisplayName?.charAt(0)}
                </UserAvatar>

                <h4
                  style={{
                    paddingLeft: "60px",
                    fontWeight: 600,
                    fontSize: 22,
                  }}
                >
                  {status.postDisplayName}
                </h4>

                <div
                  style={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    paddingLeft: "60px",
                  }}
                >
                  <span
                    onClick={() =>
                      sessionStorage.setItem("scrollPosition", window.scrollY)
                    }
                  >
                    <Tooltip
                      title={
                        <span
                          style={{
                            fontWeight: "500",
                            fontStyle: "italic",
                          }}
                        >
                          {formatDate(status.createdAt?.seconds)}
                        </span>
                      }
                      placement="bottom"
                      mouseLeaveDelay={0}
                    >
                      <Moment fromNow unix>
                        {status.createdAt?.seconds}
                      </Moment>
                    </Tooltip>
                  </span>
                </div>
              </div>
            </div>
          </Card.Header>

          {/* StatusBody */}
          <Card.Body>
            <EditPostForm status={status} ref={childRef} />
          </Card.Body>
        </Card>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleOk} style={{ width: "100%" }}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
