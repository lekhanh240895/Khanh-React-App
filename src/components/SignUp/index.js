import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";

export const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const history = useHistory();
  const [isSucced, setIsSucced] = useState(false);
  const { addDocument } = useAppContext();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Password does not match!");
    }

    try {
      setError("");
      setIsLoading(true);
      const userCredential = await signup(
        emailRef.current.value,
        passwordRef.current.value
      );
      setIsSucced(true);

      addDocument("users", {
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        photoURL: userCredential.user.photoURL,
        uid: userCredential.user.email,
        providerID: userCredential.user.providerData[0].providerId,
      });

      setTimeout(() => history.push("/update-profile"), 1000);
    } catch (error) {
      const errMessage = error.message.replace("Firebase: ", "");
      setError(errMessage);
    }

    setIsLoading(false);
  };
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "400px",
          boxShadow: "10px 10px 5px 5px grey",
        }}
      >
        <Card.Header as="h1" className="mb-4">
          Sign Up
        </Card.Header>

        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {isSucced && (
            <Alert
              variant="success"
              className="text-center"
              style={{ fontWeight: "600", fontSize: "1.5rem" }}
            >
              Signup Successfull. Redirecting....
            </Alert>
          )}

          <Form onSubmit={handleSignUpSubmit}>
            <Form.Group>
              <Form.Label htmlFor="email">Email:</Form.Label>
              <Form.Control
                id="email"
                type="email"
                ref={emailRef}
                required
              ></Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="password">Password:</Form.Label>
              <Form.Control
                id="password"
                type="password"
                ref={passwordRef}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="passwordConfirm">
                Confirm Your Password:
              </Form.Label>
              <Form.Control
                id="passwordConfirm"
                type="password"
                ref={passwordConfirmRef}
                required
              ></Form.Control>
            </Form.Group>

            <Button disabled={isLoading} type="submit" className="w-100 my-3">
              Sign Up
            </Button>
          </Form>

          <div className="">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SignUp;
