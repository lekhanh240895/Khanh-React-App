import React from "react";
import { Col, Offcanvas, Row } from "react-bootstrap";
import "./style.css";

import RoomList from "../RoomList";
import UserInfo from "../UserInfo";
import { useAppContext } from "../../../contexts/AppContext";
export default function Sidebar() {
  const { showChatSidebar, setShowChatSidebar } = useAppContext();
  return (
    <div className="room-sidebar" style={{ height: "85vh" }}>
      <Offcanvas
        show={showChatSidebar}
        onHide={() => setShowChatSidebar(false)}
        scroll={true}
        className="room-sidebar"
      >
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>
            <UserInfo />
          </Offcanvas.Title>
        </Offcanvas.Header>

        <hr />

        <Offcanvas.Body>
          <RoomList />
        </Offcanvas.Body>
      </Offcanvas>

      <Row className="mx-2">
        <Col xs={24} className="mb-4 mt-3">
          <UserInfo />
        </Col>

        <hr />

        <Col xs={24} className="mb-4">
          <RoomList />
        </Col>
      </Row>
    </div>
  );
}
