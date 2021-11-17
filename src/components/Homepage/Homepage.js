import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  ProgressBar,
  Alert,
  Image,
  Spinner,
  Row,
  Col,
  Container,
  Card,
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
  list,
  listAll,
} from "firebase/storage";
import useDeviceInfo from "../hooks/useDeviceInfo";
<<<<<<< HEAD
import useFirestore from "../hooks/useFirestore";
import { useAppContext } from "../../contexts/AppContext";
import { db } from "../../firebase/config";
import { doc, setDoc, increment, arrayUnion } from "firebase/firestore";
=======
import Avatar from "../Profile/Avatar/index.js"
>>>>>>> a69ffe7e420a932057ee2644c859798f60176106

export default function Homepage() {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState(null);
  const [urls, setUrls] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);

  const [status, setStatus] = useState("");
  const { updateDocument } = useAppContext();

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

  const loadAllImages = () => {
    const listRef = ref(storage, `${user.email}/Images`);
    listAll(listRef)
      .then((res) => {
        res.items.forEach(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          setImgUrls((prevState) => [...prevState, url]);
        });
      })
      .catch((error) => setError(error.message));
  };

  const deviceInfo = useDeviceInfo();
  useEffect(() => {
    const loadImg = async () => {
      const listRef = ref(storage, `${user.email}/Images`);
      let firstPage;

      if (deviceInfo.isMobile) {
        firstPage = await list(listRef, { maxResults: 6 });
      } else if (deviceInfo.isTablet) {
        firstPage = await list(listRef, { maxResults: 9 });
      } else {
        firstPage = await list(listRef, { maxResults: 12 });
      }

      firstPage.items.forEach(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        setImgUrls((prevState) => [...prevState, url]);
      });
    };
    loadImg();
    //eslint-disable-next-line
  }, []);

  const handleClose = () => {
    setShow(false);
    setUrls([]);
    setIsBlocking(false);
    /* urls.forEach((url) => {
      const httpRef = ref(storage, url);
      deleteObject(httpRef);
    }); */
  };

  const handleShow = () => setShow(true);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  //Get DOC ID
  const condition = useMemo(() => {
    return {
      fieldName: "email",
      operator: "==",
      compareValue: user.email,
    };
  }, [user.email]);

  const userDocs = useFirestore("users", condition);

  const handlePostStatus = (e) => {
    e.preventDefault();

    updateDocument("users", userDocs[0].id, {
      status: arrayUnion({
        content: status,
      }),
    });
  };

  const UploadModal = (
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
    </div>
  );

  const Pictures = (
    <Card>
      <Card.Header>
        <div className="">
          <Card.Title onClick={loadAllImages} style={{ cursor: "pointer" }}>
            Pictures
          </Card.Title>
<<<<<<< HEAD

          <Card.Title onClick={loadAllImages} style={{ cursor: "pointer" }}>
            Show all pictures
          </Card.Title>
=======
>>>>>>> a69ffe7e420a932057ee2644c859798f60176106
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          {imgUrls.map((url) => (
            <Col xs={6} md={4} className="p-1">
              <Image
                src={url}
                alt={`${user.displayName}-photoUpload`}
                style={{ height: "125px", width: "100%" }}
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );

  const Avatar = (
    <Image
      src={user.photoURL}
      alt="Avatar"
      style={{
        borderRadius: "50%",
        width: "40px",
        height: "40px",
      }}
    />
  );
  console.log({ user });

  return (
    <Container className="bg-white">
      {UploadModal}
      <Row className="pt-3">
        <Col md>{Pictures}</Col>

        <Col md>
<<<<<<< HEAD
          <Card>
            <Card.Header>
              <Card.Title>Homepage</Card.Title>
            </Card.Header>
            <Card.Body className="px-0 my-2">
              <Form onSubmit={handlePostStatus}>
                <div className="d-flex align-items-center justify-content-between">
                  <div>{Avatar}</div>
                  <Form.Control
                    as="textarea"
                    type="text"
                    placeholder="What are you thinking?"
                    style={{
                      borderRadius: "10px",
                      height: "40px",
                    }}
                    onChange={(e) => handleStatusChange(e)}
                    value={status}
                  />
                  <Button type="submit" disabled={!status}>
                    Post
                  </Button>
                </div>
              </Form>
            </Card.Body>

            <Card.Footer>
              <div>
                <FontAwesomeIcon
                  icon={["fas", "images"]}
                  size="lg"
                  onClick={handleShow}
                  style={{ cursor: "pointer" }}
                  className="text-primary"
                />
              </div>
            </Card.Footer>
          </Card>

          <Card className="my-3">
            <Card.Header>
              <div>
                <div style={{ float: "left" }}>{Avatar}</div>
                <h5
                  style={{
                    fontSize: "20px",
                    paddingLeft: "50px",
                    lineHeight: "0.6",
                    fontWeight: "",
                  }}
                >
                  {user.displayName}
                </h5>
                <p style={{ fontSize: "14px", paddingLeft: "50px" }}>
                  1 hours ago
                </p>
              </div>
            </Card.Header>
            <Card.Body>{status}</Card.Body>
            <Card.Footer>
              <FontAwesomeIcon icon={["fas", "heart"]} />
              <FontAwesomeIcon icon={["fas", "comments"]} />
            </Card.Footer>
          </Card>
=======
          <h1>Homepage</h1>
          <div className="">
            <Avatar />
            <textarea
              type="text"
              placeholder="What are you thinking?"
              style={{ padding: "1rem", borderRadius: "10px", width: "100%" }}
            />
          </div>

          <div className="my-3">


            <FontAwesomeIcon
              icon={["fas", "images"]}
              size="lg"
              onClick={handleShow}
              style={{ cursor: "pointer" }}
            />

          </div>
>>>>>>> a69ffe7e420a932057ee2644c859798f60176106
        </Col>
      </Row>
    </Container>
  );
}
