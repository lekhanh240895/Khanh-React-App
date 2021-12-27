import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  ProgressBar,
  Alert,
  Image,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import { Prompt } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { storage } from "../../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const UploadImagesModal = ({ userProfile }) => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [urls, setUrls] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setUrls([]);
    setIsBlocking(false);
    /*  urls.forEach((url) => {
        const httpRef = ref(storage, url);
        deleteObject(httpRef);
      }); */
  };

  const handleUploadFiles = (path, file) => {
    setError("");
    setIsLoading(true);

    if (file) {
      const imageRef = ref(
        storage,
        `${userProfile.email}/${path}/${file.name}`
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
          setUrls((prevState) => [...prevState, url]);
          setProgress(null);
          setIsLoading(false);
        }
      );
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        handleUploadFiles("Images", newImage);
      }
    }
  };

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

  //Missing Upload Photo To Firebase Storage with another path
  const handleUpload = async () => {
    try {
      setImgUrls(imgUrls.concat(urls));
      handleClose();
      setIsBlocking(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      <Prompt
        when={isBlocking}
        message={(location) => {
          return location.pathname === "/"
            ? true
            : JSON.stringify({
                header: "Leave this page?",
                content:
                  "You are not finishing your works. Are you sure want to leave?",
              });
        }}
      />

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <Form.Control
            id="photo"
            type="file"
            multiple
            onChange={(e) => {
              setIsBlocking(e.target.files.length > 0);
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
                  <div key={fileUrl}>
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
                              width: "50vw",
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

      <OverlayTrigger
        key="right"
        placement="right"
        overlay={
          <Tooltip id={`tooltip-right`}>
            <span style={{ fontSize: "1rem" }}>Add Images</span>
          </Tooltip>
        }
      >
        <span
          onClick={handleShow}
          style={{ cursor: "pointer" }}
          className="text-primary"
        >
          <FontAwesomeIcon icon={["fas", "images"]} size="lg" />
        </span>
      </OverlayTrigger>
    </div>
  );
};

export default UploadImagesModal;
