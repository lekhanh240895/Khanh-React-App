import React, { useState, useEffect } from "react";
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
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "./index.css";
import { Prompt } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { storage } from "../../firebase/config";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  list,
} from "firebase/storage";
import useDeviceInfo from "../hooks/useDeviceInfo";
import { useAppContext } from "../../contexts/AppContext";
import { arrayRemove } from "firebase/firestore";
import { v1 as uuidv1 } from "uuid";
import Moment from "react-moment";
import { Route, useParams, NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import StatusForm from "./StatusForm";
import Avatar from "./Avatar";
import Pictures from "./Pictures";
import Comment from "./Comment";
import PostCommentForm from "./Comment/PostCommentForm";

export default function Homepages() {
  const { users } = useAppContext();
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Navbar variant="dark">
        <Container>
          <h4>People you may know</h4>
          <Nav>
            {users.map((user) => (
              <li key={user.email}>
                <NavLink to={`/${user.email}`} activeClassName="text-white">
                  <Avatar user={user} />
                </NavLink>
              </li>
            ))}
          </Nav>
        </Container>
      </Navbar>

      <Route path={`/:profileUid`}>
        <Homepage users={users} />
      </Route>
    </div>
  );
}

function Homepage({ users }) {
  const { profileUid } = useParams();
  const [isUser, setIsUser] = useState(false);
  const { updateDocument, userDocs } = useAppContext();
  const userProfile = users.find(({ uid }) => uid === profileUid);

  useEffect(() => {
    if (userDocs[0]?.email === userProfile?.email) {
      setIsUser(true);
    }
  }, [userDocs, userProfile]);

  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [isPosted, setIsPosted] = useState(false);

  const [progress, setProgress] = useState(null);
  const [urls, setUrls] = useState([]);
  const [imgUrls, setImgUrls] = useState([]);

  // const [status, setStatus] = useState("");

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

  //Load Photos
  const deviceInfo = useDeviceInfo();
  useEffect(() => {
    const loadImg = async () => {
      const listRef = ref(storage, `${userProfile?.email}/Images`);
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
    urls.forEach((url) => {
      const httpRef = ref(storage, url);
      deleteObject(httpRef);
    });
  };

  const handleShow = () => setShow(true);

  const handleDeleteStatus = (status) => {
    updateDocument("users", userDocs[0].id, {
      statuses: arrayRemove(status),
    });
  };

  const handleLikeStatus = (status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        /*   numOfLikes: ++status.numOfLikes, */
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].isLiked = !status.isLiked;

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleToggleCommentForm = (status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: false,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].isCommentFormOpened = !status.isCommentFormOpened;

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleCloseCommentForm = (status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].isCommentFormOpened = false;

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const onPostComment = async (data, status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].comments = newStatuses[objIndex].comments.concat({
      content: data.comment,
      commentedAt: new Date(),
      id: uuidv1(),
      isLiked: false,
    });

    await updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleDeleteComment = (status, comment) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].comments = newStatuses[objIndex].comments.filter(
      (dbComment) => dbComment.id !== comment.id
    );

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleLikeComment = async (status, comment) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    const newComments = [];
    const commentIndex = status.comments.findIndex((e) => e.id === comment.id);

    status.comments.forEach((dbComment) => {
      newComments.push({
        content: dbComment.content,
        commentedAt: dbComment.commentedAt,
        id: dbComment.id,
        isLiked: dbComment.isLiked,
      });
    });

    newComments[commentIndex].isLiked = !comment.isLiked;

    newStatuses[objIndex].comments = newComments;

    await updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const UploadModal = (
    <div>
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
    </div>
  );

  return (
    <Container className="bg-white">
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="pt-3">
        <Col md>
          <Pictures imgUrls={imgUrls} user={userProfile} />
        </Col>

        <Col md>
          <Card>
            <Card.Header>
              <Card.Title>Homepage</Card.Title>
            </Card.Header>

            {isUser && (
              <div>
                <Card.Body className="px-0 my-2">
                  <StatusForm user={userProfile} />
                </Card.Body>

                <Card.Footer>
                  {UploadModal}

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
                </Card.Footer>
              </div>
            )}
          </Card>

          <div className="d-flex flex-column-reverse">
            {userProfile?.statuses?.map((status) => (
              <Card className="my-3" key={status.id}>
                <Card.Header>
                  <div className="mt-3 d-flex justify-content-between">
                    <div>
                      <div style={{ float: "left" }}>
                        <Avatar user={userProfile} />
                      </div>
                      <h4
                        style={{
                          paddingLeft: "50px",
                          lineHeight: "0.7",
                        }}
                      >
                        {userProfile.displayName}
                      </h4>
                      <p
                        style={{
                          fontSize: "14px",
                          paddingLeft: "50px",
                          fontStyle: "italic",
                        }}
                      >
                        <Moment fromNow unix>
                          {status.postedAt.seconds}
                        </Moment>
                      </p>
                    </div>

                    {isUser && (
                      <span onClick={() => handleDeleteStatus(status)}>
                        <FontAwesomeIcon icon={["far", "trash-alt"]} />
                      </span>
                    )}
                  </div>
                </Card.Header>

                <Card.Body>{status.content}</Card.Body>

                <Card.Footer>
                  <Row className="text-center my-2">
                    <Col
                      onClick={() => handleLikeStatus(status)}
                      id="status-like"
                      style={{ cursor: "pointer" }}
                    >
                      <span>
                        <FontAwesomeIcon
                          icon={
                            status.isLiked ? ["fas", "heart"] : ["far", "heart"]
                          }
                          className={
                            status.isLiked ? "status-liked me-2" : "me-2"
                          }
                          size="lg"
                        />
                      </span>
                      <span>Like</span>
                    </Col>

                    <Col
                      onClick={() => handleToggleCommentForm(status)}
                      id="status-comment"
                      style={{ cursor: "pointer" }}
                    >
                      <span>
                        <FontAwesomeIcon
                          icon={["far", "comments"]}
                          className="me-2"
                          size="lg"
                        />
                      </span>
                      <span>Comment</span>
                    </Col>
                  </Row>

                  <div
                    style={{
                      display: status.isCommentFormOpened ? "block" : "none",
                    }}
                  >
                    {status.comments?.map((comment) => (
                      <Comment
                        key={comment.id}
                        userProfile={userProfile}
                        comment={comment}
                        onLikeComment={(comment) =>
                          handleLikeComment(status, comment)
                        }
                        onDeleteComment={(comment) =>
                          handleDeleteComment(status, comment)
                        }
                        isUser={isUser}
                      />
                    ))}

                    <PostCommentForm
                      onPostComment={(data) => onPostComment(data, status)}
                      onCloseCommentForm={() => handleCloseCommentForm(status)}
                    />
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
