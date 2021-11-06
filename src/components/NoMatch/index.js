import React from "react";
import { Link } from "react-router-dom";
import { Card, Alert } from "react-bootstrap";

export default function NoMatch() {
  return (
    <Card>
      <Card.Body>
        <Alert variant="danger" className="text-center">
          404! Page Not Found
        </Alert>
        <div className="text-center p-4">
          <h2>Go to Homepage</h2>
          <p>
            <Link to="/">Click here</Link>
          </p>
        </div>
      </Card.Body>
    </Card>
  );
}
