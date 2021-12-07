import React from "react";
import { Button,Card } from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

import UploadFileModal from "./UploadModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <Card className="d-flex flex-row justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <Card.Header as="h1" className="mb-4">
          Profile
        </Card.Header>

        <UploadFileModal />

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
