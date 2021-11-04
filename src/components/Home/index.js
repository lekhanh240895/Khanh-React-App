import React, { useState } from "react";
import { Button, Alert, Card } from "react-bootstrap";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory, Link} from "react-router-dom";


export const Home = () => {
  const { logout, currentUser } = useAuth();
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
    <Card>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <h1 className="mb-4">Profile</h1>
        <p className="text-center">
          <strong>Email:</strong> {currentUser.email}
        </p>

        <div className="text-center">
          <Button><Link to="/update-profile" className="text-white list-style-none">Update Profile</Link></Button>
        </div>
      </Card.Body>

      <div className="text-center w-100 mb-4">
        <Button onClick={handleLogOut}>Log Out</Button>
      </div>
    </Card>
  );
};

export default Home;
