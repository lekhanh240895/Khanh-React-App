import React, { useState } from "react";
import { Button, Alert, Card } from "react-bootstrap";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory, Link } from "react-router-dom";

export const Profile = () => {
  const { logout, user } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();

  const handleLogOut = async () => {
    setError("");

    try {
      await logout(auth);
      history.push("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Card className="d-flex flex-row justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <Card.Header as="h1" className="mb-4">
          Profile
        </Card.Header>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="mb-3 text-center d-flex justify-content-center">
          {user.photoURL ? (
            <Card.Img
              variant="top"
              src={user.photoURL}
              alt="Avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            ></Card.Img>
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid #0B3D6B",
                borderRadius: "50%",
                background: "#0B3D6B",
              }}
              className="text-white d-flex justify-content-center align-items-center"
            >
              <span style={{ fontSize: "30px", fontWeight: "600" }}>
                {user.displayName?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <Card.Text className="text-center">
          <strong>Email:</strong> {user.email}
        </Card.Text>

        <Card.Text className="text-center">
          <strong>Name:</strong> {user.displayName}
        </Card.Text>

        <div className="text-center mb-3">
          <Link to="/update-profile" className="text-white list-style-none">
            <Button>Update Profile</Button>
          </Link>
        </div>

        <div className="text-center w-100 mb-3">
          <Button onClick={handleLogOut}>Log Out</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Profile;
