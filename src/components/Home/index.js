import React, { useState, useEffect } from "react";
import { Button, Alert, Card } from "react-bootstrap";
import { auth } from "../../firebase/config";
import { useAuth } from "../../contexts/AuthContext";
import { useHistory, Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";

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

  useEffect(() => {
    const unsubcribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log({ data, snapshot, docs: snapshot.docs });
    });
    return unsubcribe;
  }, []);

  return (
    <Card className="d-flex flex-row justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <Card.Header as="h1" className="mb-4">
          Profile
        </Card.Header>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="text-center mb-3">
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
        </div>

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
