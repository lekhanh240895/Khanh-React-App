import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { orderBy } from "lodash";

import React from "react";
import { Accordion, Button } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";

export default function RoomList() {
  const {
    rooms,
    setIsAddRoomShowed,
    setSelectedRoomId,
    setShowChatSidebar,
    delDocument,
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

  return (
    <Accordion
      flush
      defaultActiveKey="0"
      style={{ color: "#000", backgroundColor: "inherit" }}
    >
      <Accordion.Item eventKey="0">
        <Accordion.Header>Chat Room List</Accordion.Header>
        <Accordion.Body>
          {orderedRooms?.map((room) => (
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
  );
}
