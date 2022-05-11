import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../../contexts/AppContext";
import UserAvatar from "../PersonalPages/UserAvatar";
import MyMessage from "./MyMessage";
import TheirMessage from "./TheirMessage";
import { useForm } from "react-hook-form";
import { NimblePicker } from "emoji-mart";
import data from "emoji-mart/data/facebook.json";
import { Avatar, Tooltip } from "antd";
import { orderBy } from "lodash";

export const SmallChatWindow = () => {
  const {
    userDoc,
    setShowUploadMessageImagesModal,
    messages,
    selectedRoomId,
    setSelectedRoomId,
    selectedRoom,
    members,
    addDocument,
    delDocument,
    updateDocument,
  } = useAppContext();

  const handleClose = () => {
    setSelectedRoomId("");
  };

  const handleDeleteMessage = (message) => {
    delDocument("messages", message.id);
  };

  const handleReactMessage = (message, emoReact) => {
    updateDocument("messages", message.id, {
      react: emoReact,
    });
  };

  const { register, handleSubmit, reset } = useForm();

  const divRef = useRef(null);
  const messageRef = useRef(null);

  const [showEmoBar, setShowEmoBar] = useState(false);

  const { ref, ...rest } = register("message", {
    required: true,
  });

  const onEmojiClick = (emoji, event) => {
    messageRef.current.value = messageRef.current.value.concat(emoji.native);
    messageRef.current.focus();
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  });

  const handleLike = async () => {
    await addDocument("messages", {
      content: "like",
      roomId: selectedRoomId,
      uid: userDoc.uid,
      photoURL: userDoc.photoURL,
      displayName: userDoc.displayName,
    });

    const H = divRef.current.scrollHeight;
    divRef.current?.scrollTo({ top: H, behavior: "smooth" });

    setShowEmoBar(false);
  };

  const onSubmit = async (data) => {
    await addDocument("messages", {
      content: data.message,
      roomId: selectedRoomId,
      uid: userDoc.uid,
      photoURL: userDoc.photoURL,
      displayName: userDoc.displayName,
    });

    const H = divRef.current.scrollHeight;
    divRef.current?.scrollTo({ top: H, behavior: "smooth" });

    reset();
    setShowEmoBar(false);
  };

  const [roomMembers, setRoomMembers] = useState(null);

  useEffect(() => {
    if (members?.length === 2) {
      const newMembers = members.filter(
        (member) => member.uid !== userDoc?.uid
      );
      return setRoomMembers(newMembers);
    }
    setRoomMembers(members);
  }, [members, userDoc]);

  const orderedMessages = React.useMemo(
    () => orderBy(messages, "createdAt"),
    [messages]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setSelectedRoomId("");
    }
  };

  if (!selectedRoomId) return null;

  return (
    <Card
      style={{
        width: "325px",
        minHeight: "60vh",
        margin: "0 5px",
        border: "1px solid grey",
        backgroundColor: "#fff",
        borderRadius: "10px",
      }}
    >
      <Card.Header className="d-flex flex-column flex-md-row align-items-md-center">
        <Avatar.Group maxCount="2" size="large" maxStyle={{ fontSize: "18px" }}>
          {roomMembers?.map((member) => {
            return (
              <div style={{ position: "relative" }} key={member.uid}>
                <Tooltip title={member.displayName} placement="top">
                  <UserAvatar
                    email={member.email}
                    photoURL={member.photoURL}
                    width="40px"
                    height="40px"
                    textSize="20px"
                  >
                    {member.displayName.charAt(0).toUpperCase()}
                  </UserAvatar>

                  {member.isOnline && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: "-5px",
                        right: "-3px",
                        zIndex: 99,
                      }}
                    >
                      <FontAwesomeIcon
                        icon={["fas", "circle"]}
                        style={{ width: 15, height: 15, color: "#00c900" }}
                      />
                    </span>
                  )}
                </Tooltip>
              </div>
            );
          })}
        </Avatar.Group>

        {roomMembers && (
          <h5
            style={{
              fontWeight: 550,
              fontSize: 18,
              marginLeft: "10px",
            }}
          >
            {selectedRoom.type === "invidual"
              ? roomMembers[0]?.displayName
              : selectedRoom.name}
          </h5>
        )}

        <span
          className="closed-react-modal-button"
          onClick={handleClose}
          style={{ background: "none" }}
        >
          <FontAwesomeIcon icon={["fas", "times"]} className="text-primary" />
        </span>
      </Card.Header>

      <Card.Body>
        <div
          className="messages d-flex flex-column"
          style={{ zIndex: 1, height: "40vh", overflowY: "auto" }}
          ref={divRef}
        >
          {orderedMessages.map((message, index) => {
            const isMyMessage = message.uid === userDoc?.uid;
            const keys = Object.keys(orderedMessages);
            const lastMessageKey = index === 0 ? null : keys[index - 1];
            const lastMessage = orderedMessages[lastMessageKey];

            return isMyMessage ? (
              <MyMessage
                onDeleteMessage={() => handleDeleteMessage(message)}
                onReactMessage={(emoReact) =>
                  handleReactMessage(message, emoReact)
                }
                key={message.id}
                content={message.content}
                displayName={message.displayName}
                createdAt={message.createdAt}
                photoURL={message.photoURL}
                uid={message.uid}
                lastMessage={lastMessage}
                attachments={message.attachments}
                emoReact={message.react}
              />
            ) : (
              <TheirMessage
                onDeleteMessage={() => handleDeleteMessage(message)}
                onReactMessage={(emoReact) =>
                  handleReactMessage(message, emoReact)
                }
                key={message.id}
                content={message.content}
                displayName={message.displayName}
                createdAt={message.createdAt}
                photoURL={message.photoURL}
                uid={message.uid}
                lastMessage={lastMessage}
                attachments={message.attachments}
                emoReact={message.react}
              />
            );
          })}
        </div>
      </Card.Body>

      <Card.Footer className="d-flex align-items-center px-1">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex justify-content-between align-items-center">
            <FontAwesomeIcon
              icon={["far", "grin"]}
              className="icon-react mx-2"
              style={{ fontSize: 24, zIndex: 0, cursor: "pointer" }}
              onClick={() => setShowEmoBar(!showEmoBar)}
            />

            <span
              className="text-success"
              style={{ fontSize: 24, cursor: "pointer" }}
            >
              <FontAwesomeIcon
                icon={["fas", "images"]}
                className="me-2"
                onClick={() => setShowUploadMessageImagesModal(true)}
              />
            </span>

            <Form.Control
              placeholder="Type something here"
              ref={(e) => {
                ref(e);
                messageRef.current = e; // you can still assign to ref
              }}
              {...rest}
              onKeyDown={handleKeyDown}
            />

            {messageRef.current?.value ? (
              <Button
                type="submit"
                variant="outline-primary"
                className="border-0 px-2"
              >
                <FontAwesomeIcon
                  icon={["fas", "paper-plane"]}
                  style={{ fontSize: 24 }}
                />
              </Button>
            ) : (
              <Button
                onClick={handleLike}
                variant="outline-primary"
                className="border-0 px-2"
              >
                <FontAwesomeIcon
                  icon={["fas", "thumbs-up"]}
                  style={{ fontSize: 24 }}
                />
              </Button>
            )}
          </div>
        </Form>

        {showEmoBar && (
          <NimblePicker
            set="facebook"
            onClick={onEmojiClick}
            style={{
              width: "100%",
              position: "absolute",
              bottom: "50px",
              left: "1px",
              right: "10px",
              zIndex: 99,
            }}
            data={data}
            showPreview={false}
            showSkinTones={false}
          />
        )}
      </Card.Footer>
    </Card>
  );
};
