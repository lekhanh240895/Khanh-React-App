import React, { useRef, useState, useEffect } from "react";
import { Form, Card, Button, Alert, ProgressBar } from "react-bootstrap";
import { Link, useHistory, Prompt } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { storage } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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
  const [isPhotoUrlDisabled, setIsPhotoUrlDisabled] = useState(false);

  const [fileUrl, setFileUrl] = useState("");
  const [imageFile, setImageFile] = useState();
  const [urlUpload, setUrlUpload] = useState("");
  const [progress, setProgress] = useState(0);

  const [showProgress, setShowProgress] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [showUploadUrlButton, setShowUploadUrlButton] = useState(false);

  const handleInputChange = async (file) => {
    if (file) {
      setIsPhotoUrlDisabled(true);
      setImageFile(file);
      setShowUploadButton(true);
    } else {
      setIsPhotoUrlDisabled(false);
      setShowUploadButton(false);
    }
  };

  const handleUploadPhoto = (file) => {
    const imagesRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(imagesRef, file);
    setShowProgress(true);
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
          setShowProgress(false);
          setShowUploadButton(false);
        } catch (error) {
          setError(error.message);
        }
      }
    );
  };

  const handleInputURLChange = (e) => {
    if (e.target.value.length > 0) {
      setUrlUpload(e.target.value);
      setShowUploadUrlButton(true);
    } else {
      setShowUploadUrlButton(false);
    }
  };

  //  Upload photo from an HTTP URL
  const handleUploadByURL = async () => {
    setShowUploadUrlButton(false);
    let blob = await fetch(urlUpload).then((res) => res.blob());
    // .then((blobFile) => new File([blobFile], "avatar")); To get a File from an URL

    handleUploadPhoto(blob);
  };

  useEffect(() => {
    if (
      user.displayName !== displayNameRef.current.value ||
      fileUrl ||
      emailRef.current.value !== user.email ||
      passwordRef.current.value ||
      passwordConfirmRef.current.value
    ) {
      setShowUpdateButton(true);
    } else {
      setShowUpdateButton(false);
    }
    //eslint-disable-next-line
  }, [
    fileUrl,
    displayNameRef.current?.value,
    emailRef.current?.value,
    passwordRef.current?.value,
    passwordConfirmRef.current?.value,
  ]);

  //Update Profile
  const handleUpdateProfileSubmit = (e) => {
    e.preventDefault();
    setIsBlocking(false);
    setError("");
    setShowUpdateButton(false);

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
        setTimeout(() => history.push("/"), 1500);
      })
      .catch((error) => {
        const errMessage = error.message.replace("Firebase: ", "");
        return setError(errMessage);
      })
      .finally(() => {
        setShowUpdateButton(true);
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

        <div className="mb-3 text-center d-flex justify-content-center">
          {user.photoURL ? (
            <Card.Img
              variant="top"
              src={fileUrl ? fileUrl : user.photoURL}
              alt="Avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            />
          ) : (
            <div
              style={{
                width: "100px",
                height: "100px",
                border: "1px solid #0B3D6B",
                borderRadius: "50%",
                background: "#0B3D6B",
              }}
              className="text-white d-flex justify-content-center align-items-center"
            >
              <span style={{ fontSize: "30px", fontWeight: "600" }}>
                {user.displayName?.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {showProgress && (
          <ProgressBar
            animated
            now={progress}
            label={`${progress}%`}
            max="100"
          />
        )}

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
            <Form.Label htmlFor="photo">Upload your photo:</Form.Label>

            <Form.Control
              id="photo"
              type="file"
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
                handleInputChange(e.target.files[0]);
              }}
              accept=".jpg, .jpeg, .png"
            ></Form.Control>

            <Button
              className="mt-2"
              variant="outline-primary"
              onClick={() => handleUploadPhoto(imageFile)}
              disabled={!showUploadButton}
            >
              Upload
            </Button>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="URLphoto">Or URL of your photo</Form.Label>

            <Form.Control
              id="URLphoto"
              type="text"
              onChange={(e) => {
                setIsBlocking(e.target.value.length > 0);
                handleInputURLChange(e);
              }}
              disabled={isPhotoUrlDisabled}
              placeholder="E.g: https://picsum.photos/50"
            ></Form.Control>

            <Button
              variant="outline-primary"
              className="mt-2"
              onClick={handleUploadByURL}
              disabled={!showUploadUrlButton}
            >
              Upload
            </Button>
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

          <Button
            disabled={!showUpdateButton}
            type="submit"
            className="w-100 my-3"
          >
            Update profile
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
