import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Button, Form, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../../../contexts/AppContext";
import { Avatar, Tooltip } from "antd";
import { useForm } from "react-hook-form";
import { orderBy } from "lodash";
import MyMessage from "../MyMessage";
import TheirMessage from "../TheirMessage";
import "./index.css";
import data from "emoji-mart/data/facebook.json";
import { NimblePicker } from "emoji-mart";

function ChatWindow() {
  const {
    members,
    selectedRoom,
    setIsInviteMemberShowed,
    selectedRoomId,
    addDocument,
    userDoc,
    messages,
    delDocument,
    setShowUploadMessageImagesModal,
    updateDocument,
    setShowChatSidebar,
  } = useAppContext();

  const { register, handleSubmit, reset } = useForm();
  const [input, setInput] = useState("");

  const divRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  });

  const [showEmoBar, setShowEmoBar] = useState(false);

  const { ref, ...rest } = register("message");

  const onEmojiClick = (emoji, event) => {
    setInput(input.concat(emoji.native));
    messageRef.current.focus();
  };

  useEffect(() => {
    handleScrollToBot();
  });

  const handleScrollToBot = () => {
    if (divRef.current) {
      const H = divRef.current.scrollHeight;
      divRef.current?.scrollTo({ top: H, behavior: "smooth" });
    }
  };

  const handleLike = async () => {
    await addDocument("messages", {
      content: "like",
      roomId: selectedRoomId,
      uid: userDoc.uid,
      photoURL: userDoc.photoURL,
      displayName: userDoc.displayName,
    });

    handleScrollToBot();
    setShowEmoBar(false);
  };

  const onSubmit = async (data) => {
    if (input.length > 0) {
      await addDocument("messages", {
        content: input,
        roomId: selectedRoomId,
        uid: userDoc.uid,
        photoURL: userDoc.photoURL,
        displayName: userDoc.displayName,
      });

      handleScrollToBot();
      setInput("");

      reset();
      setShowEmoBar(false);
    }
  };

  const handleDeleteMessage = (message) => {
    delDocument("messages", message.id);
  };

  const orderedMessages = React.useMemo(
    () => orderBy(messages, "createdAt"),
    [messages]
  );

  const handleReactMessage = (message, emoReact) => {
    updateDocument("messages", message.id, {
      react: emoReact,
    });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const renderHeader = () => {
    if (selectedRoom.type === "group") {
      return (
        <div
          className="header_info d-flex justify-content-between align-items-center"
          style={{ positon: "relative" }}
        >
          <div>
            <h4 className="header-title">{selectedRoom.name}</h4>

            <span className="header-description">
              {selectedRoom.description}
            </span>
          </div>

          <ButtonGroup>
            <Button
              variant="white"
              onClick={() => setIsInviteMemberShowed(true)}
            >
              <FontAwesomeIcon icon={["fas", "user-plus"]} className="me-2" />
              <span>Invite</span>
            </Button>

            <div className="d-flex align-items-center">
              <Avatar.Group
                maxCount="2"
                size="large"
                maxStyle={{ fontSize: "18px" }}
              >
                {members.map((member) => (
                  <div style={{ position: "relative" }} key={member.uid}>
                    <Tooltip title={member.displayName} placement="top">
                      <Avatar
                        src={member.photoURL}
                        style={{
                          backgroundColor: "pink",
                          fontSize: "20px",
                        }}
                      >
                        {member.displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>

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
                          style={{
                            width: 15,
                            height: 15,
                            color: "#00c900",
                          }}
                        />
                      </span>
                    )}
                  </div>
                ))}
              </Avatar.Group>
            </div>
          </ButtonGroup>
        </div>
      );
    }

    const otherMembers = members.filter(
      (member) => member.uid !== userDoc?.uid
    );
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="header_info d-flex justify-content-between align-items-center"
          style={{ positon: "relative", height: "8vh" }}
        >
          {otherMembers.map((member) => (
            <div
              style={{ position: "relative" }}
              key={member.uid}
              className="d-flex align-items-center "
            >
              <div style={{ position: "relative" }}>
                <Avatar
                  src={member.photoURL}
                  style={{
                    backgroundColor: "pink",
                    fontSize: "30px",
                    width: "60px",
                    height: "60px",
                  }}
                  className="d-flex justify-content-center align-items-center"
                >
                  {member.displayName.charAt(0).toUpperCase()}
                </Avatar>

                {member.isOnline && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-5px",
                      right: "-5px",
                      zIndex: 99,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "circle"]}
                      style={{
                        width: 18,
                        height: 18,
                        color: "#00c900",
                      }}
                    />
                  </span>
                )}
              </div>

              <span className="mx-2" style={{ fontSize: "24px" }}>
                {member.displayName}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className="bg-white"
      style={{
        padding: "10px",
        position: "relative",
        margin: 0,
        overflowY: "auto",
        borderRadius: 5,
      }}
    >
      {selectedRoomId ? (
        <div>
          {renderHeader()}

          <hr />

          <div
            className="messages d-flex flex-column"
            ref={divRef}
            style={{ zIndex: 1 }}
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

          <hr />

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between align-items-center pb-0">
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
                className="flex-grow-1"
                onChange={handleInputChange}
                value={input}
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
        </div>
      ) : (
        <div className="text-center">
          <Alert
            variant="info"
            onClick={() => setShowChatSidebar(true)}
            style={{ cursor: "pointer" }}
          >
            Please select a room
          </Alert>
        </div>
      )}
    </div>
  );
}

export default React.memo(ChatWindow);
