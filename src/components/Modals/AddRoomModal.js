import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";

export default function AddRoomModal() {
  const { isAddRoomShowed, setIsAddRoomShowed, addDocument } = useAppContext();
  const { user } = useAuth();

  const { register, handleSubmit, reset } = useForm();

  const handleClose = () => setIsAddRoomShowed(false);
  const handleOk = (data) => {
    //Add Room to firebase
    addDocument("rooms", {
      ...data,
      type: "group",
      members: [user?.uid],
    });

    reset();
    setIsAddRoomShowed(false);
  };

  return (
    <Modal show={isAddRoomShowed} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create a room chat</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleOk)}>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label htmlFor="name">Name</Form.Label>
            <Form.Control
              id="name"
              placeholder="Name of the room"
              name="name"
              {...register("name", { required: true })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label htmlFor="description">Description</Form.Label>
            <Form.Control
              id="description"
              placeholder="Description of the room"
              name="description"
              {...register("description", { required: true })}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
