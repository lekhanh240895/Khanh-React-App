import React from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import UploadAvatarModal from "./UploadAvatarModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Profile = ({ isUser, user }) => {
  return (
    <Card className="mb-4">
      <Card.Header className="mb-4">
        <Card.Title as="h1">Profile</Card.Title>
      </Card.Header>

      <Card.Body>
        <UploadAvatarModal user={user} isUser={isUser} />

        <Card.Text className="text-center">
          <strong>Email:</strong> {user.email}
          {isUser && (
            <Link to="/update-profile" className="list-style-none ms-3">
              <FontAwesomeIcon icon={["fas", "pen"]} />
            </Link>
          )}
        </Card.Text>

        <Card.Text className="text-center">
          <strong>Name:</strong> {user.displayName}
          {isUser && (
            <Link to="/update-profile" className="list-style-none ms-3">
              <FontAwesomeIcon icon={["fas", "pen"]} />
            </Link>
          )}
        </Card.Text>

        {isUser && (
          <div className="text-center mb-3">
            <Link to="/update-profile" className="text-white list-style-none">
              <Button>Update Profile</Button>
            </Link>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Profile;
