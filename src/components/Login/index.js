import React, { useRef } from "react";
/* import firebase, { auth } from "../../firebase/config"; */
import { Form, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleLoginByPassword = () => {};

  const handleLoginByFacebook = () => {};

  const handleLoginByGoogle = () => {};

  return (
    <Card className="d-flex justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <h1>My App</h1>

        <Form>
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
            <Button type="submit" onClick={handleLoginByPassword}>
              Log in
            </Button>
          </div>
        </Form>

        <Button className="w-100 mb-2" onClick={handleLoginByFacebook}>
          Login with Facebook
        </Button>

        <Button className="w-100 mb-2" onClick={handleLoginByGoogle}>
          Login with Google
        </Button>
        <div className="">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </div>
      </Card.Body>
      <p>User Logged In: </p>
    </Card>
  );
};

export default Login;
