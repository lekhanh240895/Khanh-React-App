import React, { useState } from "react";
import { Form, Button, Row, Col, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import UserAvatar from "../UserAvatar";
import { useAppContext } from "../../../contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { v1 as uuidv1 } from "uuid";
import { Tooltip } from "antd";
import data from "emoji-mart/data/facebook.json";
import { NimblePicker } from "emoji-mart";
import "./index.css";

function PostCommentForm({ status }) {
  const {
    userDoc,
    updateDocument,
    setShowUploadCommentImagesModal,
    setCommentImages,
    setSelectedStatusId,
  } = useAppContext();
  const { register, handleSubmit, reset, setFocus } = useForm();

  const [hasFocus, setHasFocus] = useState(false);

  const commentRef = React.useRef(null);

  const { ref, ...rest } = register("comment", {
    onChange: (e) => setHasFocus(true),
    onBlur: (e) => setHasFocus(false),
    required: true,
  });

  const [showEmoBar, setShowEmoBar] = useState(false);

  const onEmojiClick = (emoji, event) => {
    commentRef.current.value = commentRef.current.value.concat(emoji.native);
    commentRef.current.focus();
  };

  const handlePostComment = async (data) => {
    const { displayName, photoURL, email, uid } = userDoc;
    await updateDocument("statuses", status.id, {
      comments: status.comments.concat({
        attachments: status.uploadCommentImages || [],
        content: data.comment,
        commentedAt: new Date(),
        id: uuidv1(),
        displayName,
        photoURL,
        email,
        uid,
        people: [],
      }),
      uploadCommentImages: [],
    });

    setCommentImages([]);
    setShowEmoBar(false);
    reset();
  };

  const handleUploadImgComment = () => {
    setCommentImages([]);
    setShowUploadCommentImagesModal(true);
    setSelectedStatusId(status.id);
    setFocus("comment");
  };

  return (
    <Form onSubmit={handleSubmit(handlePostComment)}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="me-2">
          <UserAvatar
            email={userDoc?.email}
            photoURL={userDoc?.photoURL}
            width="40px"
            height="40px"
            textSize="25px"
          >
            {userDoc?.photoURL ? "" : userDoc?.displayName?.charAt(0)}
          </UserAvatar>
        </div>

        <div style={{ position: "relative" }} className="me-2 flex-grow-1">
          <Form.Control
            className="me-2"
            placeholder="Your comment..."
            id="commentInput"
            {...rest}
            name="comment"
            ref={(e) => {
              ref(e);
              commentRef.current = e; // you can still assign to ref
            }}
            style={{ padding: hasFocus && "30px 20px" }}
          />

          <Tooltip title="Emotion icons" placement="top" arrowPointAtCenter>
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "10px",
                zIndex: 0,
                cursor: "pointer",
              }}
              onClick={() => setShowEmoBar(!showEmoBar)}
            >
              <FontAwesomeIcon
                icon={["far", "grin"]}
                className="me-2 emoji-react"
                style={{ fontSize: 20 }}
              />
            </span>
          </Tooltip>

          <Tooltip title="Add images" placement="top" arrowPointAtCenter>
            <span
              onClick={handleUploadImgComment}
              style={{
                position: "absolute",
                right: "45px",
                top: "10px",
                zIndex: 0,
                cursor: "pointer",
              }}
              className="text-success icon-wrapper"
              type="file"
            >
              <FontAwesomeIcon
                icon={["fas", "images"]}
                style={{ fontSize: 20 }}
              />
            </span>
          </Tooltip>

          {showEmoBar && (
            <NimblePicker
              set="facebook"
              onClick={onEmojiClick}
              style={{
                width: "100%",
                position: "absolute",
                bottom: hasFocus ? "100px" : "50px",
                zIndex: 99,
              }}
              data={data}
            />
          )}
        </div>

        <Button type="submit">Post</Button>
      </div>

      {status.uploadCommentImages?.length > 0 && (
        <Row className="my-3 ms-5">
          {status.uploadCommentImages?.map((img) => (
            <Col key={img} xs={4} className="p-2 pt-1">
              <Image fluid src={img} alt={"comment-upload"} rounded />
            </Col>
          ))}
        </Row>
      )}
    </Form>
  );
}

export default React.memo(PostCommentForm);
