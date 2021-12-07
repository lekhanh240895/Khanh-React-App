import React, { useState, useEffect } from "react";
import {
  Alert,
  Image,
  Row,
  Col,
  Container,
  Card,
  Modal,
  Carousel,
} from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";

import { storage } from "../../firebase/config";
import { ref, getDownloadURL, listAll } from "firebase/storage";
import "./index.css";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; */

export default function Photos() {
  const { user } = useAuth();
  const [error, setError] = useState("");

  const [imgUrls, setImgUrls] = useState([]);

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

  const [showPhotos, setShowPhotos] = useState(false);

  const handleShowPhotos = () => setShowPhotos(true);
  const handleClose = () => setShowPhotos(false);

  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Container className="bg-white">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="pt-3">
        <Card.Header>
          <Card.Title>Pictures</Card.Title>
        </Card.Header>

        <Card.Body>
          {showPhotos && (
            <Modal show={showPhotos} fullscreen onHide={handleClose}>
              <Carousel activeIndex={index} onSelect={handleSelect}>
                {imgUrls.map((url) => (
                  <Carousel.Item key={url}>
                    <img
                      className="d-block w-100"
                      src={url}
                      alt="Photos"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Modal>
          )}

          <Row>
            {imgUrls.map((url) => (
              <Col xs={6} md={4} className="p-1" key={url}>
                <Image
                  src={url}
                  alt={`${user.displayName}-photos`}
                  id="photos"
                  style={{ cursor: "pointer" }}
                  onClick={handleShowPhotos}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
