import React from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import ChatWindow from "../ChatWindow";
import Status from "../PersonalPages/Status";

export default function Homepage() {
  const { users } = useAppContext();
  
  return (
    <Row>
      <Col sm={10}>
        {users.map((user) => (
          <Status userProfile={user} key={user.email} />
        ))}
      </Col>
      <Col sm className="d-none d-sm-block">
        <ChatWindow />
      </Col>
    </Row>
  );
}
