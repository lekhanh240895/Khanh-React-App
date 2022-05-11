import React from "react";
import { Col, Offcanvas, Row } from "react-bootstrap";
import "./style.css";

import RoomList from "../RoomList";
import UserInfo from "../UserInfo";
import { useAppContext } from "../../../contexts/AppContext";
export default function Sidebar() {
  const { showChatSidebar, setShowChatSidebar } = useAppContext();
  return (
    <div
      className="room-sidebar"
      style={{
        height: "85vh",
        padding: 15,
        overflowY: "auto",
      }}
    >
      <Offcanvas
        show={showChatSidebar}
        onHide={() => setShowChatSidebar(false)}
        scroll={true}
        className="room-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <UserInfo />
          </Offcanvas.Title>
        </Offcanvas.Header>

        <hr />

        <Offcanvas.Body>
          <RoomList />
        </Offcanvas.Body>
      </Offcanvas>

      <Row>
        <Col xs={24} className="mt-2 mb-4">
          <UserInfo />
        </Col>

        <Col xs={24} className="mb-4">
          <RoomList />
        </Col>
      </Row>
    </div>
  );
}
