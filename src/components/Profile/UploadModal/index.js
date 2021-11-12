import React, { useState, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  ProgressBar,
  Alert,
  Image,
  Spinner,
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
import { useAppContext } from "../../../contexts/AppContext";
import useFirestore from "../../hooks/useFirestore";
import { v1 as uuidv1 } from "uuid";
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
  const { updateUserProfile } = useAuth();
  const { updateDocument } = useAppContext();

  const handleClose = () => {
    setShow(false);
    handleCancelUploadFile("Images-upload", fileUpload);
  };

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
      setIsBlocking(false);
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

  const handleInputURLChange = async (e) => {
    if (e.target.value.length > 0) {
      // Get Blob File from an URL
      // let blob = await fetch(urlUpload).then((res) => res.blob());

      // const { v1: uuidv1 } = require("uuid");
      // Get a File from an URL

      const file = await fetch(e.target.value)
        .then((res) => res.blob())
        .then((blobRes) => new File([blobRes], uuidv1()))
        .catch((error) => {
          throw new Error(error);
        });

      handleUploadFile("Images-upload", file);
      setFileUpload(file);
    }
  };

  const condition = useMemo(() => {
    return {
      fieldName: "email",
      operator: "==",
      compareValue: user.email,
    };
  }, [user.email]);
  const userDocs = useFirestore("users", condition);

  const handleUpdatePhotoURL = (newPhotoURL) => {
    updateDocument("users", userDocs[0].id, {
      photoURL: newPhotoURL,
    });
  };

  const handleChangeAvatar = async () => {
    setError("");

    try {
      setIsBlocking(false);
      await updateUserProfile(user.displayName, fileUrl);
      handleUpdatePhotoURL(fileUrl);
      handleUploadFile("Avatar", fileUpload);
      handleClose();
      setFileUrl("");
      setFileUpload(null);
    } catch (error) {
      setError(error.message);
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
            : "You are not finishing your works. Are you sure to go on?";
        }}
      />

      <Avatar onShowUploadModal={handleShow} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label htmlFor="photo">Select a photo</Form.Label>
              <Form.Control
                id="photo"
                type="file"
                onChange={(e) => {
                  setIsBlocking(e.target.value.length > 0);
                  handleInputChange(e);
                }}
                accept=".jpg, .jpeg, .png"
              ></Form.Control>

              {isLoading ? (
                <div className="d-flex flex-column justify-content-center align-items-center my-5">
                  <Spinner animation="border" size="lg" variant="primary" />
                </div>
              ) : (
                fileUrl && (
                  <div
                    style={{ position: "relative" }}
                    className="d-flex flex-column justify-content-center align-items-center"
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "1.25rem",
                        right: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesomeIcon
                        className="closed-icon"
                        icon={["fas", "times"]}
                        size="lg"
                        onClick={() =>
                          handleCancelUploadFile("Images-upload", fileUpload)
                        }
                      />
                    </div>

                    <div>
                      <Image
                        variant="top"
                        src={fileUrl}
                        alt="Avatar"
                        className="my-3"
                        fluid
                        style={{
                          borderRadius: "10px",
                          width: "500px",
                        }}
                      />
                    </div>

                    {progress && (
                      <ProgressBar
                        animated
                        now={progress}
                        label={`Loading...${progress}%`}
                        max="100"
                        className="w-75 mb-3"
                      />
                    )}
                  </div>
                )
              )}
            </Form.Group>

            <div className="separator mt-3">Or</div>

            <Form.Group>
              <Form.Label htmlFor="URLphoto">URL of your photo</Form.Label>

              <Form.Control
                id="URLphoto"
                type="text"
                onChange={(e) => {
                  setIsBlocking(e.target.value.length > 0);
                  handleInputURLChange(e);
                }}
                placeholder="E.g: https://picsum.photos/500"
              ></Form.Control>
            </Form.Group>

            <div className="text-center">
              <Button
                type="reset"
                variant="outline-primary"
                className="w-50 my-3"
              >
                Reset
              </Button>
            </div>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleChangeAvatar}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
