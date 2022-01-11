import React from "react";
import { ButtonGroup, Button, Form, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Message from "../Message";
import { useAppContext } from "../../../contexts/AppContext";
import { Avatar, Tooltip } from "antd";
import { useForm } from "react-hook-form";
import { orderBy } from "lodash";

export default function ChatWindow() {
  const {
    members,
    selectedRoom,
    setIsInviteMemberShowed,
    selectedRoomId,
    addDocument,
    userDoc,
    messages,
    delDocument,
  } = useAppContext();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    addDocument("messages", {
      content: data.message,
      roomId: selectedRoomId,
      uid: userDoc.uid,
      photoURL: userDoc.photoURL,
      displayName: userDoc.displayName,
      email: userDoc.email,
    });

    reset();
  };

  const handleDeleteMessage = (message) => {
    delDocument("messages", message.id);
  };

  const orderedMessages = orderBy(messages, "createdAt");

  return (
    <div className="bg-white" style={{ height: "85vh", padding: "10px" }}>
      {selectedRoomId ? (
        <>
          <div className="header_info d-flex justify-content-between align-items-center">
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
                    <Tooltip
                      title={member.displayName}
                      placement="top"
                      key={member.uid}
                    >
                      <Avatar
                        src={member.photoURL}
                        style={{ backgroundColor: "pink", fontSize: "20px" }}
                      >
                        {member.displayName.charAt(0)}
                      </Avatar>
                    </Tooltip>
                  ))}
                </Avatar.Group>
              </div>
            </ButtonGroup>
          </div>

          <hr />

          <div
            style={{ height: "60vh", overflowY: "auto" }}
            className="d-flex flex-column"
          >
            {orderedMessages.map((message) => (
              <Message
                onDeleteMessage={() => handleDeleteMessage(message)}
                key={message.id}
                content={message.content}
                displayName={message.displayName}
                createdAt={message.createdAt}
                photoURL={message.photoURL}
                email={message.email}
              />
            ))}
          </div>

          <hr />

          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="d-flex justify-content-between align-items-center">
              <Form.Control
                placeholder="Type something here"
                className="me-2"
                {...register("message", { required: true })}
              />
              <Button type="submit">Send</Button>
            </div>
          </Form>
        </>
      ) : (
        <div className="text-center">
          <Alert variant="info">Please select a room</Alert>
        </div>
      )}
    </div>
  );
}
