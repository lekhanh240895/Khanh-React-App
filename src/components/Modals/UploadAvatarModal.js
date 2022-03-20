import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  ProgressBar,
  Alert,
  Image,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v1 as uuidv1 } from "uuid";
import { storage } from "../../firebase/config";

export default function UploadAvatarModal() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [inputUrl, setInputUrl] = useState("");

  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState();
  const { updateUserProfile } = useAuth();
  const {
    updateDocument,
    userDoc,
    allMessages,
    statuses,
    showUploadAvatarModal,
    setShowUploadAvatarModal,
  } = useAppContext();

  const handleClose = () => {
    setShowUploadAvatarModal(false);
  };

  const handleUploadFile = (path, file) => {
    setError("");
    setIsLoading(true);

    if (file) {
      const imageRef = ref(
        storage,
        `${userDoc?.email}/${path}/${file.name}-${uuidv1()}`
      );
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

  const handleRemoveUploadFile = async (url) => {
    const imageRef = ref(storage, url);
    try {
      await deleteObject(imageRef);
      setFileUrl("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files[0]) {
      handleUploadFile("Images-upload", e.target.files[0]);
      // setFileUpload(e.target.files[0]);
      handleUploadFile("Avatar", e.target.files[0]);
    }
  };

  const handleInputURLChange = async (e) => {
    setInputUrl(e.target.value);
  };

  const handleUploadByUrl = async () => {
    if (inputUrl) {
      // Get Blob File from an URL
      // let blob = await fetch(urlUpload).then((res) => res.blob());

      // const { v1: uuidv1 } = require("uuid");
      // Get a File from an URL

      const file = await fetch(inputUrl)
        .then((res) => res.blob())
        .then((blobRes) => new File([blobRes], uuidv1()))
        .catch((error) => {
          throw new Error(error);
        });

      handleUploadFile("Avatar", file);
    }
  };

  const handleChangeAvatar = async (e) => {
    e.preventDefault();
    setError("");

    const promises = [];

    promises.push(updateUserProfile(userDoc?.displayName, fileUrl));

    promises.push(
      updateDocument("users", userDoc.id, {
        photoURL: fileUrl,
      })
    );

    statuses.forEach((status) => {
      if (status.postUid === userDoc?.uid) {
        promises.push(
          updateDocument("statuses", status.id, {
            postPhotoURL: fileUrl,
          })
        );
      }

      if (status.uid === userDoc?.uid) {
        promises.push(
          updateDocument("statuses", status.id, {
            photoURL: fileUrl,
          })
        );
      }
    });

    statuses.forEach((status) => {
      const updateComments = status.comments.map((comment) => {
        return comment.uid === userDoc?.uid
          ? { ...comment, photoURL: fileUrl }
          : comment;
      });

      promises.push(
        updateDocument("statuses", status.id, {
          comments: updateComments,
        })
      );
    });

    allMessages.map((message) => {
      return message.uid === userDoc?.uid
        ? promises.push(
            updateDocument("messages", message.id, {
              photoURL: fileUrl,
            })
          )
        : message;
    });

    await Promise.all(promises)
      .then(() => {
        setFileUrl("");
        handleClose();
      })
      .catch((error) => setError(error.message));
  };

  return (
    <Modal show={showUploadAvatarModal} onHide={handleClose}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Modal.Header>
        <h4>Avatar Upload</h4>
        <span className="closed-react-modal-button">
          <FontAwesomeIcon icon={["fas", "times"]} onClick={handleClose} />
        </span>
      </Modal.Header>

      <Modal.Body>
        <Form.Group className="text-center">
          <Form.Label htmlFor="upload-photo">
            <div className="d-flex justify-content-center align-items-center upload-photo-wrapper">
              <span className="me-2 upload-photo-icon">
                <FontAwesomeIcon icon={["fas", "plus"]} />
              </span>
              <span>Add Images</span>
            </div>
          </Form.Label>

          <Form.Control
            id="upload-photo"
            type="file"
            multiple
            onChange={(e) => {
              handleInputChange(e);
            }}
            accept=".jpg, .jpeg, .png"
            style={{ display: "none" }}
          />
        </Form.Group>

        <Form.Group>
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
                <span className="remove-image-icon">
                  <FontAwesomeIcon
                    className="closed-icon"
                    icon={["fas", "times"]}
                    size="lg"
                    onClick={() => handleRemoveUploadFile(fileUrl)}
                  />
                </span>

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

        <div
          className="separator mt-3"
          style={{ fontSize: "16px", opacity: "0.6" }}
        >
          Or
        </div>

        <Form.Group>
          <Form.Label htmlFor="URLphoto">Url of your photo</Form.Label>

          <div className="d-flex">
            <Form.Control
              id="URLphoto"
              type="text"
              onChange={(e) => {
                handleInputURLChange(e);
              }}
              placeholder="E.g: https://picsum.photos/500"
              className="me-2"
            />
            <Button variant="outline-primary" onClick={handleUploadByUrl}>
              Find
            </Button>
          </div>
        </Form.Group>

        <div className="text-center">
          <Button
            type="reset"
            variant="outline-primary"
            className="w-50 my-3"
            onClick={() => {
              setFileUrl("");
              handleRemoveUploadFile(fileUrl);
            }}
          >
            Reset
          </Button>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={handleChangeAvatar}
          disabled={!fileUrl}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
