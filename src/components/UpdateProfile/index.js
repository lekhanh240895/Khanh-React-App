import React, { useRef, useState, useEffect, useMemo } from "react";
import { Form, Card, Button, Alert, ProgressBar } from "react-bootstrap";
import { Link, useHistory, Prompt } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { storage } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v1 as uuidv1 } from "uuid";
// Create timestamp uuid: uuidv1()
// Create random uuid: uuidv4()
import { useAppContext } from "../../contexts/AppContext";
import useFirestore from "../hooks/useFirestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const UpdateProfile = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displayNameRef = useRef();

  const [error, setError] = useState("");
  const { user, updateUserEmail, updateUserPassword, updateUserProfile } =
    useAuth();
  const [isSucced, setIsSucced] = useState(false);
  const history = useHistory();
  const [isBlocking, setIsBlocking] = useState(false);
  const [photoUrl, photoUrlUpload] = useState(false);

  const [fileUpload, setFileUpload] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [progress, setProgress] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      user.displayName !== displayNameRef.current.value ||
      fileUrl ||
      emailRef.current.value !== user.email ||
      passwordRef.current.value ||
      passwordConfirmRef.current.value
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
    //eslint-disable-next-line
  }, [
    fileUrl,
    displayNameRef.current?.value,
    emailRef.current?.value,
    passwordRef.current?.value,
    passwordConfirmRef.current?.value,
  ]);

  const { updateDocument } = useAppContext();
  const condition = useMemo(() => {
    return {
      fieldName: "email",
      operator: "==",
      compareValue: user.email,
    };
  }, [user.email]);
  const userDocs = useFirestore("users", condition);
  const handleUpdateDocument = () => {
    updateDocument("users", userDocs[0].id, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.email,
    });
  };

  //Upload photo to Firebase Storage
  const handleUploadPhoto = (path, file) => {
    const imagesRef = ref(storage, `${path}/${file.name}`);
    const metadata = {
      contentType: "image/jpeg",
    };
    const uploadTask = uploadBytesResumable(imagesRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => setError(error.message),
      async () => {
        try {
          const url = await getDownloadURL(imagesRef);
          setFileUrl(url);
          setProgress(null);
        } catch (error) {
          setError(error.message);
        }
      }
    );
  };

  const handleInputChange = async (e) => {
    if (e.target.files[0]) {
      photoUrlUpload(false);
      handleUploadPhoto("Images-upload", e.target.files[0]);
      setFileUpload(e.target.files[0]);
    } else {
      photoUrlUpload(true);
      setFileUpload(null);
    }
  };

  const handleInputURLChange = async (e) => {
    if (e.target.value.length > 0) {
      // Get Blob File from an URL
      // let blob = await fetch(urlUpload).then((res) => res.blob());

      // const { v1: uuidv1 } = require("uuid");
      // Get a File from an URL
      const file = await fetch(e.target.value)
        .then((res) => res.blob())
        .then((blobRes) => new File([blobRes], uuidv1()))
        .catch((error) => setError(error.message));

      handleUploadPhoto("Images-upload", file);
      setFileUpload(e.target.files[0]);
    } else {
      setFileUpload(null);
    }
  };

  //Update Profile
  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    setIsBlocking(false);
    setError("");
    setIsLoading(false);

    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Password does not match");
    }

    const promises = [];

    if (passwordRef.current.value) {
      promises.push(updateUserPassword(passwordRef.current.value));
    }

    if (emailRef.current.value !== user.email) {
      promises.push(updateUserEmail(emailRef.current.value));
    }

    if (fileUrl !== "") {
      promises.push(updateUserProfile(displayNameRef.current.value, fileUrl));
    } else {
      promises.push(
        updateUserProfile(displayNameRef.current.value, user.profileURL)
      );
    }

    Promise.all(promises)
      .then(() => {
        setIsSucced(true);
        handleUpdateDocument();
        handleUploadPhoto("Avatar", fileUpload);
        setTimeout(() => history.push("/profile"), 1000);
      })
      .catch((error) => {
        const errMessage = error.message.replace("Firebase: ", "");
        return setError(errMessage);
      })
      .finally(() => {
        setIsLoading(true);
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
              defaultValue={user?.displayName}
              required
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
              }}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="photo">Change Avatar</Form.Label>

            <Form.Control
              id="photo"
              type="file"
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
                handleInputChange(e);
              }}
              accept=".jpg, .jpeg, .png"
            ></Form.Control>

            {fileUrl && (
              <div className="d-flex flex-column justify-content-center align-items-center">
                <Card.Img
                  variant="top"
                  src={fileUrl}
                  alt="Avatar"
                  className="w-100 my-3"
                  style={{
                    height: "auto",
                    borderRadius: "10px",
                  }}
                />

                <FontAwesomeIcon
                  icon={["fas", "times"]}
                  onClick={() => setFileUrl("")}
                  size="lg"
                />

                {progress && (
                  <ProgressBar
                    animated
                    now={progress}
                    label={`Loading...${progress}%`}
                    max="100"
                    className="w-75 mb-3"
                  />
                )}
              </div>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="URLphoto">URL of your photo</Form.Label>

            <Form.Control
              id="URLphoto"
              type="text"
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
                handleInputURLChange(e);
              }}
              disabled={!photoUrl}
              placeholder="E.g: https://picsum.photos/50"
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

          <Button disabled={!isLoading} type="submit" className="w-100 my-3">
            Update profile
          </Button>
        </Form>
        <div className="text-center">
          <Link to="/profile">Cancel</Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UpdateProfile;
