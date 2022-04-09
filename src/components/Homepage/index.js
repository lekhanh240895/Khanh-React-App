import { orderBy } from "lodash";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";

import StatusBar from "../PersonalPages/StatusBar";
import Statuses from "../PersonalPages/Statuses";
import RightPanel from "../PersonalPages/RightPanel/index";
import "./index.css";

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

      <Col
        className="d-none d-md-block"
        md={4}
        lg={3}
        style={{
          maxHeight: "calc(100vh - 100px)",
          height: "fit-content",
          position: "sticky",
          top: "0",
          overflowY: "auto",
          minWidth: "200px",
        }}
      >
        <RightPanel />
      </Col>
    </Row>
  );
}
