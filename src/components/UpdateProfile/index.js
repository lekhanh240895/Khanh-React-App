import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const UpdateProfile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserEmail, updateUserPassword, currentUser } = useAuth();
  const [isSucced, setIsSucced] = useState(false);
  const history = useHistory();

  const handleSignUpSubmit = (e) => {
    e.preventDefault();

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Password does not match!");
    }

    const promises = [];
    setError("");
    setIsLoading(true);

    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateUserEmail(emailRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        setIsSucced(true);
        setTimeout(() => history.push("/"), 1500);
      })
      .catch((error) => {
        const errMessage = error.message.replace("Firebase: ", "");
        return setError(errMessage);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <Card>
      <Card.Body>
        <h1>Update Profile</h1>

        {isSucced && (
          <Alert
            variant="success"
            className="text-center"
            style={{ fontWeight: "600", fontSize: "1.5rem" }}
          >
            Update Successfull. Redirecting....
          </Alert>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSignUpSubmit}>
          <Form.Group>
            <Form.Label>Your Email:</Form.Label>
            <Form.Control
              type="email"
              ref={emailRef}
              required
              defaultValue={currentUser?.email}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Your Password:</Form.Label>
            <Form.Control type="password" ref={passwordRef}></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Your Password:</Form.Label>
            <Form.Control
              type="password"
              ref={passwordConfirmRef}
            ></Form.Control>
          </Form.Group>

          <Button disabled={isLoading} type="submit" className="w-100 my-3">
            Update
          </Button>
        </Form>

        <div className="text-center">
          <Link to="/">Cancel</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UpdateProfile;
