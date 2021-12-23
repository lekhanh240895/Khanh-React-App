import React from "react";
import { Button, Card } from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

import UploadAvatarModal from "./UploadAvatarModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <Card className="mb-4">
      <Card.Header className="mb-4">
        <Card.Title as="h1">Profile</Card.Title>
      </Card.Header>

      <Card.Body>
        <UploadAvatarModal />

        <Card.Text className="text-center">
          <strong>Email:</strong> {user.email}
          <Link to="/update-profile" className="list-style-none ms-3">
            <FontAwesomeIcon icon={["fas", "pen"]} />
          </Link>
        </Card.Text>

        <Card.Text className="text-center">
          <strong>Name:</strong> {user.displayName}
          <Link to="/update-profile" className="list-style-none ms-3">
            <FontAwesomeIcon icon={["fas", "pen"]} />
          </Link>
        </Card.Text>

        <div className="text-center mb-3">
          <Link to="/update-profile" className="text-white list-style-none">
            <Button>Update Profile</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Profile;
