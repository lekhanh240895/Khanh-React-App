import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  ProgressBar,
  Image,
  Spinner,
} from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { storage } from "../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useAppContext } from "../../contexts/AppContext";
import { v1 as uuidv1 } from "uuid";

const UploadImageCommentModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [urls, setUrls] = useState([]);
  const {
    showUploadCommentImagesModal,
    setShowUploadCommentImagesModal,
    userDoc,
    updateDocument,
    selectedStatusId,
  } = useAppContext();

  const handleClose = () => {
    setUrls([]);
    setShowUploadCommentImagesModal(false);

    /* urls.forEach((url) => {
      const httpRef = ref(storage, url);
      deleteObject(httpRef);
    }); */
  };

  const handleUploadFiles = (path, file) => {
    setIsLoading(true);

    if (file) {
      const imageRef = ref(
        storage,
        `${userDoc?.email}/${path}/comments/${file.name}-${uuidv1()}`
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
        (error) => console.log(error.message),
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
      console.log(error.message);
    }
  };

  //Missing Upload Photo To Firebase Storage with another path
  const handleUpload = async () => {
    try {
      updateDocument("statuses", selectedStatusId, {
        uploadCommentImages: urls,
      });

      handleClose();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal
      show={showUploadCommentImagesModal}
      onHide={handleClose}
      keyboard={false}
    >
      <Modal.Header>
        <h4>Comment Images Upload</h4>
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

        {isLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center my-5">
            <Spinner animation="border" size="lg" variant="primary" />
          </div>
        ) : (
          <div>
            {urls.map((fileUrl) => (
              <div key={fileUrl}>
                {fileUrl && (
                  <div
                    style={{ position: "relative" }}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <span className="remove-image-icon">
                      <FontAwesomeIcon
                        icon={["fas", "times"]}
                        size="lg"
                        onClick={() => handleRemoveFile(fileUrl)}
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
                          width: "100%",
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
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpload}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadImageCommentModal;
