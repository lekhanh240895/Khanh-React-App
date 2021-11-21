import React, { useState, useEffect } from "react";
import { Alert, Image, Row, Col, Container, Card } from "react-bootstrap";

import { useAuth } from "../../contexts/AuthContext";

/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; */
import { storage } from "../../firebase/config";
import { ref, getDownloadURL, listAll } from "firebase/storage";

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

  return (
    <Container className="bg-white">
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between">
            <Card.Title>Pictures</Card.Title>
          </div>
        </Card.Header>

        <Card.Body>
          <Row>
            {imgUrls.map((url) => (
              <Col xs={6} md={4} className="p-1">
                <Image
                  src={url}
                  alt={`${user.displayName}-photoUpload`}
                  style={{ height: "25vh", width: "100%" }}
                />
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
