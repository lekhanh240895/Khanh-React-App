import React from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import Avatar from "../../Avatar";
import { useAppContext } from "../../../../contexts/AppContext";

export default function PostCommentForm({
  userProfile,
  onPostComment,
  onCloseCommentForm,
}) {
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
        <Avatar userProfile={userDoc} />

        <Form.Control
          {...register(`comment`)}
          className="me-2"
          placeholder="Write your comments"
        />

        <FontAwesomeIcon
          icon={["fas", "times"]}
          style={{
            position: "absolute",
            right: "70px",
            top: "5px",
          }}
          onClick={onCloseCommentForm}
        />
        <Button type="submit">Post</Button>
      </div>
    </Form>
  );
}
