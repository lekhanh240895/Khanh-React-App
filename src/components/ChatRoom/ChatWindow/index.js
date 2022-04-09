import React, { useRef, useState } from "react";
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

  return (
    <div
      className="bg-white"
      style={{
        height: "85vh",
        padding: "10px",
        position: "relative",
        margin: 0,
      }}
    >
      {selectedRoomId ? (
        <>
          <div
            className="header_info d-flex justify-content-between align-items-center"
            style={{ positon: "relative", height: "10vh" }}
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
                          style={{ backgroundColor: "pink", fontSize: "20px" }}
                        >
                          {member.displayName.charAt(0)}
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
                            style={{ width: 15, height: 15, color: "#00c900" }}
                          />
                        </span>
                      )}
                    </div>
                  ))}
                </Avatar.Group>
              </div>
            </ButtonGroup>
          </div>

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

          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "calc(100% - 20px)",
              zIndex: 9,
            }}
            className="p-1 mb-1"
          >
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
          </div>

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
        </>
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
