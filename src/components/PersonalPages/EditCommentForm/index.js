import React, { useEffect, useState } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";
import { useForm } from "react-hook-form";
import UserAvatar from "../UserAvatar";
import { useAppContext } from "../../../contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "antd";
import data from "emoji-mart/data/facebook.json";
import { NimblePicker } from "emoji-mart";
import { storage } from "../../../firebase/config";
import {
  ref as fbRef,
  uploadBytesResumable,
  getDownloadURL,
  // deleteObject,
} from "firebase/storage";
import { v1 as uuidv1 } from "uuid";
import "./index.css";

function EditCommentForm({ status, comment, setShowEditComment }) {
  const { userDoc, updateDocument } = useAppContext();
  const { register, handleSubmit } = useForm();
  const [hasFocus, setHasFocus] = useState(false);
  const [showEmoBar, setShowEmoBar] = useState(false);
  const commentRef = React.useRef(null);
  const [urls, setUrls] = useState(comment.attachments || []);

  useEffect(() => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  });

  const { ref, ...rest } = register("comment", {
    onChange: (e) => setHasFocus(true),
    onBlur: (e) => setHasFocus(false),
    required: urls.length > 0 ? false : true,
  });

  const onEmojiClick = (emoji, event) => {
    commentRef.current.value = commentRef.current.value.concat(emoji.native);
    commentRef.current.focus();
  };

  const handleUpdateComment = async (data) => {
    const newComments = status.comments.map((dbComment) => {
      if (dbComment.id === comment.id) {
        return {
          ...dbComment,
          content: commentRef.current.value,
          attachments: urls,
        };
      } else {
        return dbComment;
      }
    });

    await updateDocument("statuses", status.id, {
      comments: newComments,
    });

    setShowEditComment(false);
    setShowEmoBar(false);
  };

  const handleUploadFiles = (path, file) => {
    if (file) {
      const imageRef = fbRef(
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
          console.log("Upload: " + progress + "%");
        },
        (error) => console.log(error.message),
        async () => {
          const url = await getDownloadURL(imageRef);
          setUrls((prevState) => [...prevState, url]);
          commentRef.current.focus();
        }
      );
    }
  };
  console.log({ urls });

  const handleInputChange = (e) => {
    if (e.target.files.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        handleUploadFiles("Images", newImage);
      }
    }
  };

  const handleRemoveFile = async (url) => {
    // const httpRef = fbRef(storage, url);
    // try {
    //   await deleteObject(httpRef);
    //   const newUrls = urls.filter((fileUrl) => fileUrl !== url);
    //   setUrls(newUrls);
    // } catch (error) {
    //   console.log(error.message);
    // }
    const newUrls = urls.filter((fileUrl) => fileUrl !== url);
    setUrls(newUrls);
  };

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowEditComment(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const divRef = React.useRef();
  useOutsideAlerter(divRef);

  return (
    <Form onSubmit={handleSubmit(handleUpdateComment)} ref={divRef}>
      <div className="d-flex justify-content-between align-items-start p-3 pb-0 bg-white">
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
            defaultValue={comment.content}
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
                className="me-2 icon-react"
                style={{ fontSize: 20 }}
              />
            </span>
          </Tooltip>

          <Tooltip title="Add images" placement="top" arrowPointAtCenter>
            <Form.Label htmlFor="upload-photo">
              <span
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
      </div>

      {urls.length > 0 && (
        <Row className="my-3 ms-5">
          {urls.map((url) => (
            <Col
              key={url}
              xs={4}
              className="p-2 pt-1"
              style={{ position: "relative" }}
            >
              <Image fluid src={url} alt={"comment-upload"} rounded />
              <span className="edit-comment_remove-image-icon">
                <FontAwesomeIcon
                  icon={["fas", "times"]}
                  size="lg"
                  onClick={() => handleRemoveFile(url)}
                />
              </span>
            </Col>
          ))}
        </Row>
      )}

      <div style={{ paddingLeft: "60px" }}>
        Press to{" "}
        <span
          onClick={() => setShowEditComment(false)}
          className="text-primary"
          style={{ cursor: "pointer", fontStyle: "italic" }}
        >
          cancel
        </span>
      </div>
    </Form>
  );
}

export default React.memo(EditCommentForm);
