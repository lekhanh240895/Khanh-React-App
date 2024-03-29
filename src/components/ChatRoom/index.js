import React from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow/index.js";
import { Col, Row } from "react-bootstrap";

export default function ChatRoom() {
  return (
    <Row>
      <Col className="d-none d-md-block m-0" md={4}>
        <Sidebar />
      </Col>
      <Col xs={12} md={8}>
        <ChatWindow />
      </Col>
    </Row>
  );
}
