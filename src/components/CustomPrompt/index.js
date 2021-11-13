/* global JSON */
import React from "react";
import { Modal, Button } from "react-bootstrap";

const CustomPrompt = ({ message, cleanUp }) => {
  const parsedMessage = JSON.parse(message);

  const cancel = () => cleanUp(false);
  const ok = () => cleanUp(true);

  return (
    <Modal.Dialog onClose={cancel}>
      <Modal.Header closeButton>
        <Modal.Title>
          If you leave the page, the following data will be lost:
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* <ul>
          {Object.entries(parsedMessage.fields).map(([key, value]) => {
            return (
              <li key={key}>
                <b>{key}:</b> {value}
              </li>
            );
          })}
        </ul> */}
        Do you want to leave this site? Changes you made may not be saved.
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={cancel}>
          Close
        </Button>
        <Button variant="primary" onClick={ok}>
          Save changes
        </Button>
      </Modal.Footer>
    </Modal.Dialog>
  );
};

export default CustomPrompt;
