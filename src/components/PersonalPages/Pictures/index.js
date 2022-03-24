import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Row, Image, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./index.css";

export default function Pictures({ imgUrls, user }) {
  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between">
          <Card.Title>
            <span className="text-primary me-2">
              <FontAwesomeIcon icon={["fas", "images"]} size="lg" />
            </span>

            <span>Pictures</span>
          </Card.Title>

          <Card.Title style={{ cursor: "pointer" }}>
            <Link
              style={{ textDecoration: "none" }}
              to={`/${user.email}/photos`}
            >
              Show all pictures
            </Link>
          </Card.Title>
        </div>
      </Card.Header>

      <Card.Body>
        <Row>
          {imgUrls.map((url) => (
            <Col key={url} xs={6} md={4} className="p-1">
              <div className="picture-wrapper">
                <Image
                  fluid
                  src={url}
                  alt={`${user.displayName}-photoUpload`}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}
