import React, { useState } from "react";
import { Button, Alert, Card } from "react-bootstrap";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory, Link } from "react-router-dom";

export const Home = () => {
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

        <Card.Img variant="top" src={user.photoURL} alt="Avatar"></Card.Img>

        <Card.Text className="text-center">
          <strong>Email:</strong> {user.email}
        </Card.Text>

        <Card.Text className="text-center">
          <strong>Name:</strong> {user.displayName}
        </Card.Text>

        <div className="text-center mb-3">
          <Button>
            <Link to="/update-profile" className="text-white list-style-none">
              Update Profile
            </Link>
          </Button>
        </div>

        <div className="text-center w-100 mb-3">
          <Button onClick={handleLogOut}>Log Out</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Home;
