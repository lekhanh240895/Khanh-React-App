import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";

import { orderBy } from "lodash";

import { useAppContext } from "../../../contexts/AppContext";
import useFirestore from "../../hooks/useFirestore";
import StatusBar from "../StatusBar/index";
import Statuses from "../Statuses/index";

export default function Homepage() {
  const { userDoc, homepageScrollPosition } = useAppContext();
  const statuses = useFirestore("statuses", "");

  const orderedStatuses = orderBy(statuses, "createdAt", "desc");

  const handleScrollPosition = () => {
    if (homepageScrollPosition) {
      window.scrollTo({
        top: parseInt(homepageScrollPosition),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("load", handleScrollPosition());
    return () => {
      window.removeEventListener("load", handleScrollPosition());
    };
  });

  return (
    <Row>
      <Col sm={12}>
        <StatusBar userProfile={userDoc} />

        <Statuses statuses={orderedStatuses} />
      </Col>
    </Row>
  );
}
