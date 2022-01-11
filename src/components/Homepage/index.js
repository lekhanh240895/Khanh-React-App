import React from "react";
import { Col, Row } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import Statuses from "../PersonalPages/Statuses";
import useFirestore from "../hooks/useFirestore";
import { orderBy } from "lodash";
import StatusBar from "../PersonalPages/StatusBar";

export default function Homepage({ imgUrls, setImgUrls }) {
  const { userDoc } = useAppContext();
  const statuses = useFirestore("statuses", "");

  const orderedStatuses = orderBy(statuses, "createdAt", "desc");
  return (
    <Row>
      <Col sm={12}>
        <StatusBar
          userProfile={userDoc}
          imgUrls={imgUrls}
          setImgUrls={setImgUrls}
        />

        <Statuses statuses={orderedStatuses} userProfile={userDoc} />
      </Col>
    </Row>
  );
}
