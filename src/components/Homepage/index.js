import { orderBy } from "lodash";
import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";

import StatusBar from "../PersonalPages/StatusBar";
import Statuses from "../PersonalPages/Statuses";

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
    <div>
      <Row>
        <Col sm={12}>
          <StatusBar userProfile={userDoc} />
          <Statuses statuses={orderedStatuses} />
        </Col>
      </Row>
    </div>
  );
}
