import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory, Prompt } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { useAppContext } from "../../../contexts/AppContext";
import usePreventReload from "../../hooks/usePreventReload";

export const UpdateProfile = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const passwordConfirmRef = useRef("");
  const displayNameRef = useRef("");
  const [error, setError] = useState("");
  const [isSucced, setIsSucced] = useState(false);
  const history = useHistory();
  const [isBlocking, setIsBlocking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateDocument, userDoc, statuses, allMessages } = useAppContext();
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
    //Update user doc
    updateDocument("users", userDoc.id, {
      displayName: user.displayName,
      email: user.email,
    });

    /* Update Status, Comment, Messages */
    statuses.forEach((status) => {
      if (status.postUid === userDoc?.uid) {
        updateDocument("statuses", status.id, {
          postDisplayName: user.displayName,
        });
      }

      if (status.uid === userDoc?.uid) {
        updateDocument("statuses", status.id, {
          displayName: user.displayName,
        });
      }
    });

    statuses.forEach((status) => {
      const updateComments = status.comments.map((comment) => {
        return comment.uid === userDoc?.uid
          ? { ...comment, displayName: user.displayName }
          : comment;
      });

      updateComments &&
        updateDocument("statuses", status.id, {
          comments: updateComments,
        });
    });

    allMessages.map((message) => {
      return message.uid === userDoc?.uid
        ? updateDocument("messages", message.id, {
            displayName: user.displayName,
          })
        : message;
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
          Update Profile
        </Card.Header>
        <Card.Body>
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
            <Button disabled={!displayNameRef.current.value}>
              <Link
                to={`/${user.email}`}
                style={{ listStyle: "none", color: "#fff" }}
              >
                Cancel
              </Link>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UpdateProfile;
