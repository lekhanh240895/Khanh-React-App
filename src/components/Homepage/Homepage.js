import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  ProgressBar,
  Alert,
  Image,
} from "react-bootstrap";

import { useAuth } from "../../../contexts/AuthContext";
import { Prompt } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { storage } from "../../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Avatar from "../Avatar/index.js";
import "./index.css";

export default function UploadFileModal() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fileUpload, setFileUpload] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUploadFile = (path, file) => {
    setError("");
    setIsLoading(true);

    if (file) {
      const imageRef = ref(storage, `${user.email}/${path}/${file.name}`);
      const metadata = {
        contentType: "image/jpeg",
      };
      const uploadTask = uploadBytesResumable(imageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => setError(error.message),
        async () => {
          const url = await getDownloadURL(imageRef);
          setFileUrl(url);
          setProgress(null);
          setIsLoading(false);
        }
      );
    }
  };

  const handleCancelUploadFile = (path, file) => {
    if (file) {
      const imagesRef = ref(storage, `${user.email}/${path}/${file.name}`);
      deleteObject(imagesRef);
      setFileUrl("");
      setFileUpload(null);
    } else {
      setShow(false);
      setFileUrl("");
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files[0]) {
      handleUploadFile("Images-upload", e.target.files[0]);
      setFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="mb-3  d-flex justify-content-center">
      {error && <Alert variant="danger">{error}</Alert>}

      <Prompt
        when={isBlocking}
        message={(location, action) => {
          return location.pathname.startsWith("/profile")
            ? true
            : `Are you sure you want to go to ${location.pathname}?`;
        }}
      />

      <Avatar onShowUploadModal={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form.Control
            id="photo"
            type="file"
            onChange={(e) => {
              setIsBlocking(e.target.value.length > 0);
              handleInputChange(e);
            }}
            accept=".jpg, .jpeg, .png"
          ></Form.Control>

          {fileUrl && (
            <div className="d-flex flex-column justify-content-center align-items-center">
              <div style={{ position: "relative" }}>
                <Image
                  variant="top"
                  src={fileUrl}
                  alt="Avatar"
                  className="my-3"
                  fluid
                  style={{
                    borderRadius: "10px",
                  }}
                />

                {!isLoading && (
                  <FontAwesomeIcon
                    className="closed-icon"
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      right: "0.75rem",
                      cursor: "pointer",
                    }}
                    icon={["fas", "times"]}
                    size="lg"
                    onClick={() =>
                      handleCancelUploadFile("Images-upload", fileUpload)
                    }
                  />
                )}
              </div>

              {progress && (
                <ProgressBar
                  animated
                  now={progress}
                  visibility-hidden
                  label={`Loading...${progress}%`}
                  max="100"
                  className="w-75 mb-3"
                />
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
