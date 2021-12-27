import React from "react";
import { Card, Row, Image, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import UploadImagesModal from "../UploadImagesModal";

export default function Pictures({ imgUrls, user, setImgUrls }) {
  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between">
          <Card.Title>
            <span className="me-2">
              <UploadImagesModal
                userProfile={user}
                imgUrls={imgUrls}
                setImgUrls={setImgUrls}
              />
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
              <Image
                src={url}
                alt={`${user.displayName}-photoUpload`}
                style={{
                  height: "25vh",
                  width: "100%",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              />
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
}
