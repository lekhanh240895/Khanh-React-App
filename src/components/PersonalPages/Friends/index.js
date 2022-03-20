import React from "react";
import { Card, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Friends({ users, userProfile }) {
  return (
    <Card className="mb-4">
      <Card.Header>
        <div className="d-flex justify-content-between">
          <Card.Title>
            <span className="text-primary me-2">
              <FontAwesomeIcon icon={["fas", "user-friends"]} />
            </span>
            <span>Friends</span>
          </Card.Title>
        </div>
      </Card.Header>

      <Card.Body>
        <Row>
          {users
            .filter((user) => user.email !== userProfile?.email)
            .map((user) => (
              <Col xs={6} md={4} className="p-1" key={user.email}>
                <Link to={`/${user.email}`} style={{ textDecoration: "none" }}>
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={`${user.displayName}-Avatar`}
                      style={{
                        height: "25vh",
                        width: "100%",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: "25vh",
                        width: "100%",
                        cursor: "pointer",
                        borderRadius: "5px",
                        background: "pink",
                      }}
                      className="text-white d-flex justify-content-center align-items-center"
                    >
                      <span style={{ fontSize: "100px", fontWeight: "600" }}>
                        {user.displayName?.charAt(0)}
                      </span>
                    </div>
                  )}
                </Link>

                <div className="text-center">
                  <Link to={`/${user.email}`} id="friends-list">
                    <span
                      style={{
                        fontSize: "20px",
                        cursor: "pointer",
                      }}
                    >
                      {user.displayName}
                    </span>
                  </Link>
                </div>
              </Col>
            ))}
        </Row>
      </Card.Body>
    </Card>
  );
}
