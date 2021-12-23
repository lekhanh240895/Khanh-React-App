import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory /* useLocation */ } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";

export const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, loginWithFacebook, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  // const location = useLocation();
  // const { from } = location.state || { from: { pathname: "/" } };
  const [isSucced, setIsSucced] = useState(false);

  const { users, addDocument } = useAppContext();

  const handleLoginByPassword = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setIsLoading(true);
      const { user } = await login(
        emailRef.current.value,
        passwordRef.current.value
      );

      if (users.every((dbUser) => dbUser.email !== user.email)) {
        addDocument("users", {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.email,
          providerID: user.providerData[0].providerId,
        });
      }

      //function IsDiffer = (element, index, array) => {
      //   return element.email !== user.email
      // }
      // if (users.every(isDiffer)) {}

      setIsSucced(true);
      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (error) {
      const errMessage = error.message.replace("Firebase: ", "");
      setError(errMessage);
    }

    setIsLoading(false);
  };

  const handleLoginByFacebook = async () => {
    try {
      setError("");
      setIsLoading(true);
      await loginWithFacebook();
      setIsSucced(true);
      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (error) {
      const errMessage = error.message.replace("Firebase: ", "");
      setError(errMessage);
    }
    setIsLoading(false);
  };

  const handleLoginByGoogle = async () => {
    try {
      setError("");
      await loginWithGoogle();
      setIsSucced(true);
      setTimeout(() => {
        history.push("/");
      }, 1000);
    } catch (error) {
      const errMessage = error.message.replace("Firebase: ", "");
      setError(errMessage);
    }
    setIsLoading(false);
  };

  return (
    <Card className="d-flex flex-row justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <Card.Header as="h1" className="mb-4">
          My App
        </Card.Header>

        {isSucced && (
          <Alert
            variant="success"
            className="text-center"
            style={{ fontWeight: "500", fontSize: "1.5rem" }}
          >
            Login Successfull. Redirecting....
          </Alert>
        )}

        {error && (
          <Alert
            variant="danger"
            className="text-center"
            style={{ fontWeight: "500", fontSize: "1.5rem" }}
          >
            {error}
          </Alert>
        )}

        <Form onSubmit={handleLoginByPassword}>
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

          <div className="text-center my-3">
            <Button disabled={isLoading} type="submit">
              Log in
            </Button>
          </div>
        </Form>

        <Button
          type="button"
          className="w-100 mb-1"
          disabled={isLoading}
          onClick={handleLoginByFacebook}
        >
          Login with Facebook
        </Button>

        <Button
          type="button"
          className="w-100 mb-3"
          disabled={isLoading}
          onClick={handleLoginByGoogle}
        >
          Login with Google
        </Button>

        <div className="text-center mb-2">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>

        <div className="text-center">
          Need an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Login;
