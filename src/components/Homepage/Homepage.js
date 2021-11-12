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

import { useAuth } from "../../contexts/AuthContext";
import { Prompt } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { storage } from "../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

export default function Homepage() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState(null);
  //   const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleUploadFiles = (path, file) => {
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
          setUrls((prevState) => [...prevState, url]);
          setProgress(null);
          setIsLoading(false);
        }
      );
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files[0]) {
      for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        handleUploadFiles("Images", newImage);
      }
    }
  };

  console.log({ urls });

  const handleRemoveFile = async (url) => {
    const httpRef = ref(storage, url);
    try {
      await deleteObject(httpRef);
      const newUrls = urls.filter((fileUrl) => fileUrl !== url);
      setUrls(newUrls);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpload = async () => {
    try {
      setIsBlocking(false);
      handleClose();
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

      <Button onClick={handleShow}>Click</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form.Control
            id="photo"
            type="file"
            multiple
            onChange={(e) => {
              setIsBlocking(e.target.value.length > 0);
              handleInputChange(e);
            }}
            accept=".jpg, .jpeg, .png"
          />

          {isLoading ? (
            <div className="d-flex flex-column justify-content-center align-items-center my-5">
              <Spinner animation="border" size="lg" variant="primary" />
            </div>
          ) : (
            <>
              {urls.map((fileUrl) => {
                return (
                  <div>
                    {fileUrl && (
                      <div
                        style={{ position: "relative" }}
                        className="d-flex justify-content-center align-items-center"
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
                            onClick={() => handleRemoveFile(fileUrl)}
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
                    )}
                  </div>
                );
              })}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
