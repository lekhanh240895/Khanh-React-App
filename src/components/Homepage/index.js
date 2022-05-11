import { orderBy } from "lodash";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import StatusBar from "../PersonalPages/StatusBar";
import Statuses from "../PersonalPages/Statuses";
import RightPanel from "../PersonalPages/RightPanel/index";
import "./index.css";
import { SmallChatWindow } from "../SmallChatWindow";

export default function Homepage() {
  const { userDoc, statuses } = useAppContext();

  const orderedStatuses = orderBy(statuses, "createdAt", "desc");

  useEffect(() => {
    if (statuses.length) {
      const scrollPosition = sessionStorage.getItem("scrollPosition");
      if (scrollPosition) {
        window.scrollTo({
          top: parseInt(scrollPosition, 10),
          behavior: "smooth",
        });
        sessionStorage.removeItem("scrollPosition");
      }
    }
  }, [statuses]);

  return (
    <Row className="homepage">
      <Col xs={12} md={8} lg={9}>
        <StatusBar userProfile={userDoc} />
        <Statuses statuses={orderedStatuses} />
      </Col>

      <Col className="d-none d-md-block" md={4} lg={3}>
        <RightPanel />

        <div
          style={{
            position: "fixed",
            bottom: 0,
            right: "15%",
            zIndex: 9999,
            display: "flex",
            flexDirection: "row-reverse",
          }}
        >
          <SmallChatWindow />
        </div>
      </Col>
    </Row>
  );
}
