import React from "react";
import { Card, Col } from "react-bootstrap";
import CountUp from "react-countup";

const HighlightCard = ({ item }) => {
  return (
    <Col xs={12} sm={4}>
      <Card
        style={{
          borderLeft:
            item.type === "confirmed"
              ? "5px solid red"
              : item.type === "recovered"
              ? "5px solid green"
              : "5px solid blue",
        }}
      >
        <Card.Body>
          <Card.Text as="h4" style={{ fontSize: "18px" }}>
            {item.title}
          </Card.Text>
          <Card.Text as="span" style={{ fontSize: "24px", fontWeight: "700" }}>
            <CountUp end={item.count} duration={1} separator=" " />
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default HighlightCard;
