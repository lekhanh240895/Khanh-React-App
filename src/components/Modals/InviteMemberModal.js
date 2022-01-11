import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useAppContext } from "../../contexts/AppContext";
import { useForm } from "react-hook-form";
import UserAvatar from "../PersonalPages/UserAvatar/index";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { includes } from "lodash";

export default function InviteMemberModal() {
  const {
    isInviteMemberShowed,
    setIsInviteMemberShowed,
    users,
    selectedRoomId,
    selectedRoom,
    updateDocument,
  } = useAppContext();

  const { handleSubmit, reset } = useForm();

  const [value, setValue] = useState([]);

  const handleClose = () => setIsInviteMemberShowed(false);
  const handleOk = () => {
    const newMembers = value.map((val) => val.value);

    updateDocument("rooms", selectedRoomId, {
      members: selectedRoom.members.concat(newMembers),
    });

    reset();
    setIsInviteMemberShowed(false);
  };

  const fetchOptions = () => {
    const options = users
      .filter((user) => !includes(selectedRoom.members, user.uid))
      .map((user) => ({
        value: user.uid,
        label: (
          <div key={user.uid} className="d-flex align-items-center">
            <UserAvatar photoURL={user.photoURL} width="20px" height="20px">
              {user?.displayName?.charAt(0).toUpperCase()}
            </UserAvatar>
            <span className="ms-2">
              {user.displayName}
            </span>
          </div>
        ),
      }));
    return options;
  };

  const animatedComponents = makeAnimated();

  return (
    <Modal show={isInviteMemberShowed} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Invite more member</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(handleOk)}>
        <Modal.Body>
          <Form.Group>
            <Select
              isMulti
              name="Invite Members"
              className="basic-multi-select"
              classNamePrefix="select"
              closeMenuOnSelect={false}
              components={animatedComponents}
              options={fetchOptions()}
              onChange={(newValue) => setValue(newValue)}
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
