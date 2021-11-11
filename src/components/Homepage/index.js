import React, { useState } from "react";
import {
  ProgressBar,
  Alert,
  Form,
  Button,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import { storage } from "../../firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default function Homepage() {
  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState();
  const [error, setError] = useState();

  const handleInputChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      setImages((prevState) => [...prevState, e.target.files[i]]);
    }
  };

  console.log(images);

  const handleUploadImages = () => {
    const promises = [];
    images.forEach((image) => {
      const imagesRef = ref(storage, "images/" + image.name);
      const metadata = {
        contentType: "image/jpeg",
      };
      setProgress(true);
      const uploadTask = uploadBytesResumable(imagesRef, image, metadata);
      promises.push(uploadTask);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => setError(error.message),
        async () => {
          const url = await getDownloadURL(imagesRef);
          setUrls((prevState) => [...prevState, url]);
        }
      );
    });

    Promise.all(promises)
      .then(() => {
        return setProgress(false), alert("Upload Multiple Files Successfull");
      })
      .catch((error) => setError(error.message))
      .finally(() => {});
  };

  console.log({ urls });
  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      {progress && (
        <ProgressBar
          now={progress}
          max="100"
          label={`Loading...${progress}%`}
        />
      )}
      <h1>Homepage</h1>

      <Form>
        <Form.Group>
          <Form.Control
            multiple
            type="file"
            onChange={(e) => handleInputChange(e)}
          />
          <Button onClick={handleUploadImages}>Upload</Button>
        </Form.Group>

        <Form.Group>
          <Row>
            {urls.map((url, index) => (
              <Col xs={6} key={url + index} style={{ listStyle: "none" }}>
                <img
                  src={url}
                  alt={url}
                  style={{ width: "150px", height: "200px" }}
                />
              </Col>
            ))}
          </Row>
        </Form.Group>
      </Form>
    </Container>
  );
}
