import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };
  const [isSucced, setIsSucced] = useState(false);

  const handleLoginByPassword = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setIsLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setIsSucced(true);
      setTimeout(() => {
        if (from.pathname === "/login") {
          return history.push("/");
        }
        history.push(from);
      }, 2000);
    } catch (error) {
      const errMessage = error.message.replace("Firebase: ", "");
      setError(errMessage);
    }
    setIsLoading(false);
  };

  const handleLoginByFacebook = () => {};

  const handleLoginByGoogle = () => {};

  return (
    <Card>
      <Card.Body>
        <h1>My App</h1>

        {isSucced && (
          <Alert
            variant="success"
            className="text-center"
            style={{ fontWeight: "600", fontSize: "1.5rem" }}
          >
            Login Successfull. Redirecting....
          </Alert>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLoginByPassword}>
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

          <div className="text-center my-3">
            <Button disabled={isLoading} type="submit">
              Log in
            </Button>
          </div>
        </Form>

        <Button
          type="button"
          className="w-100 mb-1"
          onClick={handleLoginByFacebook}
        >
          Login with Facebook
        </Button>

        <Button
          type="button"
          className="w-100 mb-3"
          onClick={handleLoginByGoogle}
        >
          Login with Google
        </Button>

        <div className="text-center mb-3">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <div>
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Login;
