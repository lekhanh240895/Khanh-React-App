import React, { useRef, useState } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory, Prompt } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const UpdateProfile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displayNameRef = useRef();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, updateUserEmail, updateUserPassword, updateUserProfile } =
    useAuth();
  const [isSucced, setIsSucced] = useState(false);
  const history = useHistory();
  const [isBlocking, setIsBlocking] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [isPhotoUrlDisabled, setIsPhotoUrlDisabled] = useState(false);

  const handleFileInputChange = (file) => {
    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setFileUrl(tempUrl);
      setIsPhotoUrlDisabled(true);
    } else {
      setIsPhotoUrlDisabled(false);
    }
  };

  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    setIsBlocking(false);

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Password does not match!");
    }

    const promises = [];
    setError("");
    setIsLoading(true);

    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    if (emailRef.current.value !== user.email) {
      promises.push(updateUserEmail(emailRef.current.value));
    }

    //Display name & Photo
    if (
      (user.displayName === displayNameRef.current.value) &
      (fileUrl !== "") &
      (fileUrl !== user.photoURL)
    ) {
      promises.push(updateUserProfile(user.displayName, fileUrl));
    } else if (
      (user.displayName !== displayNameRef.current.value) &
      (fileUrl === "")
    ) {
      promises.push(
        updateUserProfile(displayNameRef.current.value, user.profileURL)
      );
    } else if (
      (user.displayName !== displayNameRef.current.value) &
      (fileUrl !== "") &
      (fileUrl !== user.photoURL)
    ) {
      promises.push(updateUserProfile(displayNameRef.current.value, fileUrl));
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
          message="Seem you are not finishing your works. Are you sure want to leave?"
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
              defaultValue={user.displayName}
              onChange={(e) => setIsBlocking(e.target.value.length > 0)}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="photo">Upload your photo:</Form.Label>
            <Form.Control
              id="photo"
              type="file"
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
                handleFileInputChange(e.target.files[0]);
              }}
              accept=".jpg, .jpeg, .png"
            ></Form.Control>
          </Form.Group>

          {/* Photo URL test: https://picsum.photos/50 */}

          <Form.Group>
            <Form.Label htmlFor="URLphoto">Or an URL of your photo</Form.Label>
            <Form.Control
              id="URLphoto"
              type="text"
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
                setFileUrl(e.target.value);
              }}
              disabled={isPhotoUrlDisabled}
              defaultValue="https://picsum.photos/50"
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="email">Email:</Form.Label>
            <Form.Control
              id="email"
              type="email"
              ref={emailRef}
              required
              defaultValue={user.email}
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
