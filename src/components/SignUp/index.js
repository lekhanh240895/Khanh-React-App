import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const SignUp = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const history = useHistory();
  const [isSucced, setIsSucced] = useState(false);

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Password does not match!");
    }
    try {
      setError("");
      setIsLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      setTimeout(() => history.push("/"));
      setIsSucced(true);
    } catch (error) {
      const errMessage = error.message.replace("Firebase: ", "");
      setError(errMessage);
    }

    setIsLoading(false);
  };
  return (
    <Card>
      <Card.Body>
        <h1>My App</h1>

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
            <Form.Label>Your Email:</Form.Label>
            <Form.Control type="email" ref={emailRef} required></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Your Password:</Form.Label>
            <Form.Control
              type="password"
              ref={passwordRef}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Confirm Your Password:</Form.Label>
            <Form.Control
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
  );
};

export default SignUp;