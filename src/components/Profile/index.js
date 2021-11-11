import React, { useState, useMemo } from "react";
import { Button, Alert, Card, Modal, Form, ProgressBar } from "react-bootstrap";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { Link, Prompt } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { storage } from "../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useAppContext } from "../../contexts/AppContext";
import useFirestore from "../hooks/useFirestore";
import { v1 as uuidv1 } from "uuid";
import "./index.css";
// Create timestamp uuid: uuidv1()
// Create random uuid: uuidv4()

export const Profile = () => {
  const { logout, user } = useAuth();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const [fileUpload, setFileUpload] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState();
  const { updateUserProfile } = useAuth();
  const { updateDocument } = useAppContext();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUploadFile = (path, file) => {
    const imagesRef = ref(storage, `${user.email}/${path}/${file.name}`);
    const metadata = {
      contentType: "image/jpeg",
    };
    const uploadTask = uploadBytesResumable(imagesRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => setError(error.message),
      async () => {
        try {
          const url = await getDownloadURL(imagesRef);
          setFileUrl(url);
          setProgress(null);
        } catch (error) {
          setError(error.message);
        }
      }
    );
  };

  const handleCancelUploadFile = (path, file) => {
    const imagesRef = ref(storage, `${user.email}/${path}/${file.name}`);
    deleteObject(imagesRef);
    setFileUrl("");
    setFileUpload(null);
  };

  const handleInputChange = async (e) => {
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
        .catch((error) => setError(error.message));

      handleUploadFile("Images-upload", file);
      setFileUpload(file);
    }
  };

  const handleLogOut = async () => {
    setError("");

    try {
      await logout(auth);
    } catch (error) {
      setError(error.message);
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

  const handleUpdateDocument = () => {
    updateDocument("users", userDocs[0].id, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.email,
    });
  };

  const handleChangeAvatar = async () => {
    setError("");

    try {
      setIsBlocking(false);
      await updateUserProfile(user, user.displayName, fileUrl);
      handleUpdateDocument();
      handleUploadFile("Avatar", fileUpload);
      setShow(false);
      setFileUrl("");
      setFileUpload(null);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card className="d-flex flex-row justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <Card.Header as="h1" className="mb-4">
          Profile
        </Card.Header>

        {error && <Alert variant="danger">{error}</Alert>}

        <Prompt
          when={isBlocking}
          message={(location, action) => {
            if (!location.pathname.startsWith("/profile")) {
              handleCancelUploadFile("Images-upload", fileUpload);
            }

            return location.pathname.startsWith("/profile")
              ? true
              : `Are you sure you want to go to ${location.pathname}?`;
          }}
        />

        <div className="mb-3  d-flex justify-content-center">
          {user.photoURL ? (
            <div style={{ position: "relative" }}>
              <Card.Img
                variant="top"
                src={user.photoURL}
                alt="Avatar"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                }}
              />
              <FontAwesomeIcon
                icon={["fas", "camera"]}
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  cursor: "pointer",
                }}
                onClick={handleShow}
              />
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
                onClick={handleShow}
              />
            </div>
          )}

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

                  {fileUrl && (
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <div style={{ position: "relative" }}>
                        <Card.Img
                          variant="top"
                          src={fileUrl}
                          alt="Avatar"
                          className="my-3"
                          fluid
                          style={{
                            // width: "100%",
                            // height: "300px",
                            borderRadius: "10px",
                          }}
                        />

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
                      </div>

                      {progress && (
                        <ProgressBar
                          animated
                          now={progress}
                          label={`Loading...${progress}%`}
                          visibly-hidden
                          max="100"
                          className="w-75 mb-3"
                        />
                      )}
                    </div>
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
                    placeholder="E.g: https://picsum.photos/50"
                  ></Form.Control>
                </Form.Group>
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

        <Card.Text className="text-center">
          <strong>Email:</strong> {user.email}
        </Card.Text>

        <Card.Text className="text-center">
          <strong>Name:</strong> {user.displayName}
        </Card.Text>

        <div className="text-center mb-3">
          <Link to="/update-profile" className="text-white list-style-none">
            <Button>Update Profile</Button>
          </Link>
        </div>

        <div className="text-center w-100 mb-3">
          <Button onClick={handleLogOut}>Log Out</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Profile;
