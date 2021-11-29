import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Row,
  Col,
  Container,
  Card,
  Modal,
} from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";

import { storage } from "../../firebase/config";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import "./index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Photos() {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const [imgUrls, setImgUrls] = useState([]);

  const [showPhoto, setShowPhoto] = useState(false);
  const handleShowPhoto = () => setShowPhoto(true);
  const handleClosePhoto = () => setShowPhoto(false);

  useEffect(() => {
    const loadAllImages = () => {
      const listRef = ref(storage, `${user.email}/Images`);
      listAll(listRef)
        .then((res) => {
          res.items.forEach(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            setImgUrls((prevState) => [...prevState, url]);
          });
        })
        .catch((error) => setError(error.message));
    };
    loadAllImages();
    //eslint-disable-next-line
  }, []);

  return (
    <Container className="bg-white">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="pt-3">
        <Card.Header>
          <Card.Title>Pictures</Card.Title>
        </Card.Header>

        <Card.Body>
          <Row>
            {imgUrls.map((url) => (
              <Col xs={6} md={4} className="p-1">
                <Modal show={showPhoto} onHide={handleClosePhoto} fullscreen>
                  <Modal.Body>
                    <div>
                      <Image fluid src={url} />
                      <FontAwesomeIcon
                        className="closed-icon"
                        icon={["fas", "times"]}
                        size="lg"
                        onClick={handleClosePhoto}
                        style={{
                          position: "absolute",
                          top: "2rem",
                          right: "2rem",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                  </Modal.Body>
                </Modal>

                <Image
                  src={url}
                  alt={`${user.displayName}-photos`}
                  id="photos"
                  onClick={handleShowPhoto}
                  style={{ cursor: "pointer" }}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
