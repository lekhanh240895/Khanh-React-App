import React from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import UserAvatar from "../UserAvatar";
import { useAppContext } from "../../../contexts/AppContext";

export default function PostCommentForm({ onPostComment }) {
  const { register, handleSubmit, reset } = useForm();
  const { userDoc } = useAppContext();

  return (
    <Form
      onSubmit={handleSubmit((data) => {
        onPostComment(data);
        reset();
      })}
    >
      <div
        className="d-flex justify-content-between align-items-center my-3"
        style={{ position: "relative" }}
      >
        <div className="me-2">
          <UserAvatar
            email={userDoc?.email}
            photoURL={userDoc?.photoURL}
            width="40px"
            height="40px"
            textSize="25px"
          >
            {userDoc?.photoURL ? "" : userDoc?.displayName?.charAt(0)}
          </UserAvatar>
        </div>

        <Form.Control
          {...register("comment", { required: true })}
          className="me-2"
          placeholder="Write your comments"
        />

        <Button type="submit">Post</Button>
      </div>
    </Form>
  );
}
