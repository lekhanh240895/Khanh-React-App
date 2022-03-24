import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import Avatar from "./Avatar/index";

export const Profile = ({ isUser, user }) => {
  return (
    <Card className="mb-4">
      <Card.Header className="mb-4">
        <Card.Title as="h1">Profile</Card.Title>
      </Card.Header>

      <Card.Body className="d-flex flex-column justify-content-center align-items-center">
        <Avatar user={user} isUser={isUser} />

        <Card.Text className="text-center">
          <span style={{ fontSize: "24px" }}>
            <strong>Email:</strong> {user.email}
          </span>
          {isUser && (
            <Link
              to="/update-profile"
              className="list-style-none ms-3"
              style={{ fontSize: "18px" }}
            >
              <FontAwesomeIcon icon={["fas", "pen"]} />
            </Link>
          )}
        </Card.Text>

        <Card.Text className="text-center">
          <span style={{ fontSize: "24px" }}>
            <strong>Name:</strong> {user.displayName}
          </span>
          {isUser && (
            <Link
              to="/update-profile"
              className="list-style-none ms-3"
              style={{ fontSize: "18px" }}
            >
              <FontAwesomeIcon icon={["fas", "pen"]} />
            </Link>
          )}
        </Card.Text>

        {isUser && (
          <div className="text-center mb-3">
            <Link to="/update-profile" className="text-white list-style-none">
              <Button size="lg">Update Profile</Button>
            </Link>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Profile;
