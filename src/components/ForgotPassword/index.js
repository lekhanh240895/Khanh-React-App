import React, { useRef, useState } from "react";
/* import firebase, { auth } from "../../firebase/config"; */
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const ForgotPassWord = () => {
  // const fbProvider = new firebase.auth.FacebookAuthProvider();
  const emailRef = useRef();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setIsLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your email for futher instructions");
    } catch (error) {
      setError(error.message);
    }

    setIsLoading(false);
  };
  return (
    <Card className="d-flex flex-row justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
      <Card.Header as="h1"  className="mb-4">Reset Password</Card.Header>
        {message && <Alert variant="success">{message}</Alert>}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleResetPassword}>
          <Form.Group>
            <Form.Label htmlFor="email">Your Email:</Form.Label>
            <Form.Control
              id="email"
              type="email"
              ref={emailRef}
              required
            ></Form.Control>
          </Form.Group>

          <Button disabled={isLoading} type="submit" className="w-100 my-3">
            Reset password
          </Button>
        </Form>

        <div className="">
          Already have an account? <Link to="/login">Login</Link>
        </div>

        <div>
          Create new account? <Link to="/signup">Sign Up</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ForgotPassWord;
