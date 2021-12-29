import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory, Prompt } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import usePreventReload from "../hooks/usePreventReload";

export const UpdateProfile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displayNameRef = useRef();
  const [error, setError] = useState("");
  const [isSucced, setIsSucced] = useState(false);
  const history = useHistory();
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateDocument, userDoc } = useAppContext();
  const { user, updateUserEmail, updateUserPassword, updateUserProfile } =
    useAuth();

  usePreventReload(isBlocking);

  useEffect(() => {
    if (
      user.displayName !== displayNameRef.current?.value ||
      emailRef.current?.value !== user.email ||
      passwordRef.current?.value ||
      passwordConfirmRef.current?.value
    ) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    //eslint-disable-next-line
  }, [
    displayNameRef.current?.value,
    emailRef.current?.value,
    passwordRef.current?.value,
    passwordConfirmRef.current?.value,
  ]);

  const handleUpdateDocument = () => {
    updateDocument("users", userDoc.id, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.email,
    });
  };

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();

    setIsBlocking(false);
    setError("");
    setIsLoading(true);
    const promises = [];
    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Password does not match");
    }

    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    if (emailRef.current.value !== user.email) {
      promises.push(updateUserEmail(emailRef.current.value));
    }

    if (displayNameRef.current.value !== user.displayName) {
      promises.push(
        updateUserProfile(displayNameRef.current.value, user.photoURL)
      );
    }

    Promise.all(promises)
      .then(() => {
        setIsSucced(true);
        handleUpdateDocument();
        setTimeout(() => history.push(`/${user.email}`), 1000);
      })
      .catch((error) => {
        const errMessage = error.message.replace("Firebase: ", "");
        return setError(errMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card className="d-flex flex-row justify-content-center align-items-center">
      <Card.Body style={{ maxWidth: "400px" }}>
        <Card.Header as="h1" className="mb-4">
          Update Profile
        </Card.Header>

        <Prompt
          when={isBlocking}
          message={JSON.stringify({
            header: "Leave this page?",
            content:
              "You are not finishing your works. Are you sure want to leave?",
          })}
        />

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

        <Form onSubmit={handleUpdateProfileSubmit}>
          <Form.Group>
            <Form.Label htmlFor="displayName">Display Name:</Form.Label>
            <Form.Control
              id="displayName"
              type="text"
              ref={displayNameRef}
              defaultValue={user?.displayName}
              required
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
              }}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="email">Email:</Form.Label>
            <Form.Control
              id="email"
              type="email"
              ref={emailRef}
              required
              defaultValue={user?.email}
              onChange={(e) => setIsBlocking(e.target.value.length > 0)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="password">New password:</Form.Label>
            <Form.Control
              id="password"
              type="password"
              ref={passwordRef}
              placeholder="Leave it blank to keep your password"
              onChange={(e) => setIsBlocking(e.target.value.length > 0)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="passwordConfirm">
              Confirm New Password:
            </Form.Label>
            <Form.Control
              id="passwordConfirm"
              type="password"
              ref={passwordConfirmRef}
              placeholder="Leave it blank to keep your password"
              onChange={(e) => setIsBlocking(e.target.value.length > 0)}
            ></Form.Control>
          </Form.Group>

          <Button disabled={isLoading} type="submit" className="w-100 my-3">
            Update profile
          </Button>
        </Form>
        
        <div className="text-center">
          <Link to={`/${user.email}`}>Cancel</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UpdateProfile;
