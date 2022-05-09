import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { orderBy } from "lodash";

import React, { useState } from "react";
import { Accordion, Button, Form } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";

export default function RoomList() {
  const {
    rooms,
    setIsAddRoomShowed,
    setSelectedRoomId,
    setShowChatSidebar,
    delDocument,
    userDoc,
    users,
  } = useAppContext();

  const handleAddRoom = () => setIsAddRoomShowed(true);
  const handleSelectRoom = (room) => {
    setShowChatSidebar(false);
    setSelectedRoomId(room.id);
  };

  const handleDeleteRoom = (room) => {
    delDocument("rooms", room.id);
    setSelectedRoomId("");
  };

  const orderedRooms = orderBy(rooms, "createdAt");
  const groupChat = orderedRooms.filter((room) => room.type === "group");
  const userChat = orderedRooms.filter((room) => room.type !== "group");

  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const inputRef = React.useRef(null);

  const searchUser = userChat.filter((room) => {
    const newStr1 = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    const newStr2 = room.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return newStr2.includes(newStr1);
  });

  const searchGroup = groupChat.filter((room) => {
    const newStr1 = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    const newStr2 = room.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return newStr2.includes(newStr1);
  });

  return (
    <div>
      <Form.Control
        type="search"
        placeholder="Search room or user"
        aria-label="Search"
        style={{ borderRadius: "20px", height: "40px" }}
        className="mb-3 px-3"
        onChange={handleChange}
        value={query}
        ref={inputRef}
      />

      <div>
        {searchUser?.map((room) => {
          const chatUserUid = room.members.find((uid) => uid !== userDoc?.uid);
          const chatUser = users.find((user) => user.uid === chatUserUid);
          return (
            <div
              key={room.id}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              <span
                onClick={() => handleSelectRoom(room)}
                style={{
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                {chatUser.displayName}
              </span>
              <span
                style={{
                  cursor: "pointer",
                }}
                onClick={() => handleDeleteRoom(room)}
              >
                <FontAwesomeIcon icon={["far", "trash-alt"]} />
              </span>
            </div>
          );
        })}
      </div>

      <Accordion flush defaultActiveKey="0" style={{ color: "#000" }}>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ border: "1px solid gray" }}>
            <span style={{ fontSize: "24px" }}>Chat Room List</span>
          </Accordion.Header>

          <Accordion.Body>
            {searchGroup?.map((room) => (
              <div
                key={room.id}
                className="d-flex justify-content-between align-items-center mb-2 ms-2"
              >
                <span
                  onClick={() => handleSelectRoom(room)}
                  style={{
                    cursor: "pointer",
                    fontSize: "20px",
                  }}
                >
                  {room.name}
                </span>
                <span
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleDeleteRoom(room)}
                >
                  <FontAwesomeIcon icon={["far", "trash-alt"]} />
                </span>
              </div>
            ))}

            <Button variant="white" onClick={handleAddRoom}>
              <span className="me-2">
                <FontAwesomeIcon icon={["fas", "plus-square"]} />
              </span>

              <span style={{ fontSize: "20px" }}>Add room</span>
            </Button>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
