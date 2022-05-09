import { Row, Col, Form } from "react-bootstrap";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { storage } from "../../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  // deleteObject,
} from "firebase/storage";
import { v1 as uuidv1 } from "uuid";
import { useAppContext } from "../../../contexts/AppContext";

const EditPostForm = ({ status }, cRef) => {
  const inputRef = React.useRef(null);

  useImperativeHandle(cRef, () => ({
    updatePost: async () => {
      await updateDocument("statuses", status.id, {
        content: inputRef.current.value,
      });

      await updateDocument("statuses", status.id, {
        attachments: urls,
      });

      setShowEditPost(false);
    },
  }));

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [urls, setUrls] = useState(status.attachments || []);
  const { userDoc, updateDocument, setShowEditPost } = useAppContext();

  const handleUploadFiles = (path, file) => {
    if (file) {
      const imageRef = ref(
        storage,
        `${userDoc?.email}/${path}/Statuses/${file.name}-${uuidv1()}`
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
          console.log("Upload status: " + progress + "%");
        },
        (error) => console.log(error.message),
        async () => {
          const url = await getDownloadURL(imageRef);
          setUrls((prevState) => [...prevState, url]);
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

  // const handleRemoveFile = async (url) => {
  //   const httpRef = ref(storage, url);
  //   try {
  //     await deleteObject(httpRef);
  //     const newUrls = urls.filter((fileUrl) => fileUrl !== url);
  //     setUrls(newUrls);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handleDeletePhoto = (url) => {
    const newUrls = urls.filter((fileUrl) => fileUrl !== url);
    setUrls(newUrls);
  };

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <div style={{ height: "50vh", overflowY: "scroll" }} className="p-2">
        <Form.Control
          defaultValue={status.content}
          style={{ border: "none" }}
          ref={inputRef}
          className="mb-2"
        />

        {urls?.length >= 2 && (
          <Row className="m-1">
            {urls.map((url, index) => (
              <Col key={url} xs={6} md={4} className="p-2 flex-grow-1">
                <div className="status-photo-wrapper">
                  <Image fluid src={url} alt={"status-upload"} rounded />
                  <span className="edit-post_remove-icon">
                    <FontAwesomeIcon
                      icon={["fas", "times"]}
                      size="lg"
                      onClick={() => handleDeletePhoto(url)}
                    />
                  </span>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {urls?.length === 1 && (
          <div className="m-1 p-2 status-photo-wrapper">
            <Image fluid src={urls[0]} alt={"status-upload"} rounded />
            <span className="edit-post_remove-icon">
              <FontAwesomeIcon
                icon={["fas", "times"]}
                size="lg"
                onClick={() => handleDeletePhoto(urls[0])}
              />
            </span>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <span style={{ fontSize: 18, fontWeight: 500 }}>
            Add to this post
          </span>
          <Form.Label
            className="text-success me-2 icon-background"
            htmlFor="upload-photo"
          >
            <FontAwesomeIcon
              icon={["fas", "images"]}
              style={{ fontSize: 20 }}
            />
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
        </div>
      </div>
    </Form>
  );
};
export default forwardRef(EditPostForm);
