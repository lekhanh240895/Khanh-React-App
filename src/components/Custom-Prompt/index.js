import React from "react";
import { Modal, Button } from "react-bootstrap";
import ReactDOM from "react-dom";

export default function CustomPrompt(message, callback, show, setShow) {
  const container = document.createElement("div");
  container.setAttribute("custom-promp", "");

  const handleConfirm = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container);
    callback(callbackState);
    setShow(false);
    console.log("callback", callbackState);
  };

  const handleCancel = (callbackState) => {
    ReactDOM.unmountComponentAtNode(container);
    callback();
    setShow(false);
    console.log("callback", callbackState);
  };

  const { header, content } = JSON.parse(message);

  document.body.appendChild(container);

  ReactDOM.render(
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{header}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{content}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>,
    container
  );
}
