import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Row,
  Col,
  Card,
  Modal,
  Carousel,
  Tabs,
  Tab,
} from "react-bootstrap";

import { storage } from "../../../firebase/config";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import "./index.css";
import { useAppContext } from "../../../contexts/AppContext";
import { useAuth } from "../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import { deleteObject } from "firebase/storage";
import { Link, useHistory } from "react-router-dom";
import { orderBy } from "lodash";

export default function UserPhotos({ userProfile }) {
  const [error, setError] = useState("");

  const [avatarsUrls, setAvatarsUrls] = useState([]);

  const history = useHistory();

  const {
    statuses,
    setSelectedStatusId,
    // setIsStatusPhotosModalShowed,
    setPhotoIndex,
    userDoc,
    updateDocument,
    allMessages,
    isUser,
    setPhotoModalShow,
    setHomepageScrollPosition,
  } = useAppContext();
  const { updateUserProfile } = useAuth();

  useEffect(() => {
    const loadAllImages = () => {
      const listAvatarRef = ref(storage, `${userProfile?.email}/Avatar`);

      listAll(listAvatarRef)
        .then((res) => {
          res.items.forEach(async (itemRef) => {
            setAvatarsUrls([]);
            const url = await getDownloadURL(itemRef);
            setAvatarsUrls((prevState) => [...prevState, url]);
          });
        })
        .catch((error) => setError(error.message));
    };
    loadAllImages();

    //eslint-disable-next-line
  }, []);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  const handleShowStatusPhotos = (status, index) => {
    // setIsStatusPhotosModalShowed(true);

    setSelectedStatusId(status.id);
    setPhotoIndex(index);
    setPhotoModalShow(true);
    setHomepageScrollPosition(window.scrollY);
  };

  const [key, setKey] = useState("timeline-photo");

  const userPhotoStatuses = statuses.filter(
    (status) =>
      status.postUid === userProfile?.uid && status.attachments.length > 0
  );

  const orderUserPhotoStatuses = orderBy(
    userPhotoStatuses,
    "createdAt",
    "desc"
  );

  const [isUploadAvatarModalShowed, setIsUploadAvatarModalShowed] =
    useState(false);

  const handleShowUploadAvatar = (index) => {
    setIsUploadAvatarModalShowed(true);
    setIndex(index);
  };

  const handleCloseUploadAvatarModal = () =>
    setIsUploadAvatarModalShowed(false);

  const handleDeleteAvatar = async () => {
    const avatarUrl = avatarsUrls[index];

    const httpRef = ref(storage, avatarUrl);
    try {
      await deleteObject(httpRef);
      const newUrls = avatarsUrls.filter((fileUrl) => fileUrl !== avatarUrl);
      setAvatarsUrls(newUrls);
    } catch (error) {
      console.log(error.message);
    }

    if (index === avatarsUrls.length - 1) {
      setIndex(0);
    }
  };

  const handleChangeAvatar = async () => {
    const avatarUrl = avatarsUrls[index];

    /* Update Profile */
    await updateUserProfile(userDoc?.displayName, avatarUrl);

    /* Update User Document */
    await updateDocument("users", userDoc.id, {
      photoURL: avatarUrl,
    });

    /* Update Status, Comment, Messages */
    await statuses.forEach((status) => {
      if (status.postUid === userDoc?.uid) {
        updateDocument("statuses", status.id, {
          postPhotoURL: avatarUrl,
        });
      }

      if (status.uid === userDoc?.uid) {
        updateDocument("statuses", status.id, {
          photoURL: avatarUrl,
        });
      }
    });

    await statuses.forEach((status) => {
      const updateComments = status.comments.map((comment) => {
        return comment.uid === userDoc?.uid
          ? { ...comment, photoURL: avatarUrl }
          : comment;
      });

      updateComments &&
        updateDocument("statuses", status.id, {
          comments: updateComments,
        });
    });

    await allMessages.map((message) => {
      return message.uid === userDoc?.uid
        ? updateDocument("messages", message.id, {
            photoURL: avatarUrl,
          })
        : message;
    });

    setIsUploadAvatarModalShowed(false);
    history.push(`/${userDoc?.email}`);
  };

  return (
    <div className="bg-white">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Header>
          <Card.Title as="h1">Pictures</Card.Title>
        </Card.Header>

        <Card.Body>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="timeline-photo" title="Timeline photos">
              {orderUserPhotoStatuses.map((status) => (
                <Link to={`/photo/${status.id}`} key={status.id}>
                  <Row className="photo-wrapper">
                    {status.attachments.length > 1 &&
                      status.attachments?.map((url, index) => (
                        <Col
                          xs={6}
                          md={4}
                          className="p-1"
                          key={`${url}-${index}`}
                        >
                          <Image
                            fluid
                            src={url}
                            alt={`${userProfile.displayName}-photo`}
                            className="timeline-photo"
                            style={{ cursor: "pointer", borderRadius: "10px" }}
                            onClick={() =>
                              handleShowStatusPhotos(status, index)
                            }
                          />
                        </Col>
                      ))}
                    {status.attachments.length === 1 &&
                      status.attachments?.map((url, index) => (
                        <Col xs={12} className="p-1" key={`${url}-${index}`}>
                          <Image
                            fluid
                            src={url}
                            alt={`${userProfile.displayName}-photo`}
                            className="timeline-photo"
                            style={{
                              cursor: "pointer",
                              borderRadius: "10px",
                            }}
                            onClick={() =>
                              handleShowStatusPhotos(status, index)
                            }
                          />
                        </Col>
                      ))}
                  </Row>
                </Link>
              ))}
            </Tab>

            <Tab eventKey="uploaded-avatar" title="Uploaded avatars">
              <Modal
                show={isUploadAvatarModalShowed}
                onHide={handleCloseUploadAvatarModal}
              >
                <Modal.Body>
                  <span
                    className="closed-photo-modal-icon"
                    onClick={handleCloseUploadAvatarModal}
                  >
                    <FontAwesomeIcon icon={["fas", "times"]} />
                  </span>

                  {isUser && (
                    <Tooltip
                      placement="bottomRight"
                      title={
                        <div
                          style={{
                            cursor: "pointer",
                            color: "#000",
                            fontSize: 14,
                          }}
                        >
                          <Row
                            onClick={handleDeleteAvatar}
                            className="status-action m-0 p-1"
                          >
                            <Col xs={3}>
                              <FontAwesomeIcon icon={["far", "trash-alt"]} />
                            </Col>
                            <Col xs>
                              <span>Delete avatar</span>
                            </Col>
                          </Row>

                          <Row
                            onClick={handleChangeAvatar}
                            className="status-action m-0 p-1"
                          >
                            <Col xs={3}>
                              <FontAwesomeIcon icon={["far", "edit"]} />
                            </Col>
                            <Col xs>
                              <span>Select this photo as avatar</span>
                            </Col>
                          </Row>
                        </div>
                      }
                      trigger="click"
                      color="#fff"
                    >
                      <span className="option-modal-icon">
                        <FontAwesomeIcon icon={["fas", "ellipsis-h"]} />
                      </span>
                    </Tooltip>
                  )}

                  <div>
                    <Carousel onSelect={handleSelect} activeIndex={index} fade>
                      {avatarsUrls.map((url) => (
                        <Carousel.Item key={url}>
                          <Image
                            fluid
                            src={url}
                            alt="Photos"
                            className="carousel-upload-avatar"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                </Modal.Body>
              </Modal>

              <Row>
                {avatarsUrls.map((url, index) => (
                  <Col
                    xs={6}
                    md={4}
                    className="p-1 photo-wrapper"
                    key={`${url}-${index}`}
                  >
                    <Image
                      src={url}
                      alt={`${userProfile.displayName}-photos`}
                      className="avatar-photo"
                      style={{ cursor: "pointer", borderRadius: "10px" }}
                      onClick={() => handleShowUploadAvatar(index)}
                    />
                  </Col>
                ))}
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
}
