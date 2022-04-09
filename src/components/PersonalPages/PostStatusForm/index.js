import React, { useState } from "react";
import { Form, Button, Image, Row, Col } from "react-bootstrap";
import UserAvatar from "../UserAvatar";
import { useAppContext } from "../../../contexts/AppContext";
import { v1 as uuidv1 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import data from "emoji-mart/data/facebook.json";
import { NimblePicker } from "emoji-mart";
import "./index.css";
import { useForm } from "react-hook-form";

function PostStatusForm({ userProfile }) {
  const [showEmoBar, setShowEmoBar] = useState(false);

  const {
    addDocument,
    userDoc,
    setShowUploadStatusImagesModal,
    uploadStatusImages,
    setUploadStatusImages,
  } = useAppContext();
  const isUser = userDoc?.email === userProfile?.email;

  const { register, handleSubmit, reset, setFocus } = useForm();

  const { ref, ...rest } = register("status", {
    required: uploadStatusImages.length > 0 ? false : true,
  });

  const statusRef = React.useRef(null);

  const onEmojiClick = (emoji, event) => {
    statusRef.current.value = statusRef.current.value.concat(emoji.native);
    statusRef.current.focus();
  };

  const handleUploadStatusImages = () => {
    setShowUploadStatusImagesModal(true);
    setFocus("status");
  };

  const handlePostStatus = async (data) => {
    await addDocument("statuses", {
      attachments: uploadStatusImages || [],
      content: data.status,
      people: [],
      comments: [],
      uid: userProfile?.uid,
      displayName: userProfile?.displayName,
      photoURL: userProfile?.photoURL,
      email: userProfile?.email,
      postUid: userDoc?.uid,
      postDisplayName: userDoc?.displayName,
      postPhotoURL: userDoc?.photoURL,
      postEmail: userDoc?.email,
      id: uuidv1(),
      isCommentTabOpened: true,
    });

    setUploadStatusImages([]);
    setShowEmoBar(false);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(handlePostStatus)}>
      <div className="d-flex align-items-center justify-content-between px-3">
        <div>
          <UserAvatar
            email={userDoc?.email}
            photoURL={userDoc?.photoURL}
            width="50px"
            height="50px"
            textSize="30px"
          >
            {userDoc?.displayName?.charAt(0)}
          </UserAvatar>
        </div>

        <div className="mx-2 flex-grow-1">
          <Form.Control
            ref={(e) => {
              ref(e);
              statusRef.current = e; // you can still assign to ref
            }}
            {...rest}
            type="text"
            placeholder={
              isUser
                ? "What are you thinking?"
                : `What do you want to say to ${userProfile.displayName}`
            }
          />
        </div>

        <Button type="submit">Post</Button>
      </div>

      <hr />

      <div
        className="d-flex justify-content-around align-items-center"
        style={{ position: "relative" }}
      >
        <Tooltip title="Emotion icons" placement="top">
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setShowEmoBar(!showEmoBar)}
          >
            <FontAwesomeIcon
              icon={["far", "grin"]}
              className="me-2 icon-react"
              style={{ fontSize: 20 }}
            />
            <span
              style={{
                fontSize: 18,
              }}
            >
              Emoji
            </span>
          </span>
        </Tooltip>

        <span
          onClick={handleUploadStatusImages}
          style={{ fontSize: 18, cursor: "pointer" }}
          htmlFor="photo"
        >
          <span
            className="text-success me-2 icon-wrapper"
            style={{ fontSize: 20 }}
          >
            <FontAwesomeIcon icon={["fas", "images"]} />
          </span>
          <span>Add images</span>
        </span>

        {showEmoBar && (
          <NimblePicker
            set="facebook"
            onClick={onEmojiClick}
            style={{
              width: "100%",
              position: "absolute",
              top: "50px",
              zIndex: 99,
            }}
            data={data}
          />
        )}
      </div>

      <Row className="mx-3">
        {uploadStatusImages.length >= 2 && (
          <Row className="m-1 d-flex">
            {uploadStatusImages.map((img) => (
              <Col
                key={img}
                xs={6}
                md={4}
                className="p-2 text-center flex-grow-1"
              >
                <Image fluid src={img} alt={"status-upload"} rounded />
              </Col>
            ))}
          </Row>
        )}

        {uploadStatusImages.length === 1 && (
          <Row className="m-1">
            {uploadStatusImages.map((img) => (
              <Col key={img} xs={12} className="p-2 text-center">
                <Image fluid src={img} alt={"status-upload"} rounded />
              </Col>
            ))}
          </Row>
        )}
      </Row>
    </Form>
  );
}

export default React.memo(PostStatusForm);
