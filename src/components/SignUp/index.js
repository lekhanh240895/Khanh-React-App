import React, { useRef, useState } from "react";
/* import firebase, { auth } from "../../firebase/config"; */
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const SignUp = () => {
  // const fbProvider = new firebase.auth.FacebookAuthProvider();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      setError("Password does not match!");
    } else {
      try {
        setError("");
        setIsLoading(true);
        await signup(emailRef.current.value, passwordRef.current.value);
      } catch (error) {
        setError(error.message);
      }
    }

    setIsLoading(false);
  };
  return (
    <Card className="d-flex justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <h1>My App</h1>

        {error && <Alert variant="danger">{error}</Alert>}

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
