import React from "react";
import { Form, Button } from "react-bootstrap";
import Avatar from "../Avatar";

export default function PostStatusForm({
  user,
  handlePostStatus,
  handleStatusChange,
  isPosted,
}) {
  return (
    <Form onSubmit={handlePostStatus}>
      <div className="d-flex align-items-center justify-content-between px-3">
        <div>
          <Avatar user={user} />
        </div>
        <Form.Control
          type="text"
          placeholder="What are you thinking?"
          style={{
            borderRadius: "10px",
            height: "40px",
          }}
          onChange={(e) => handleStatusChange(e)}
          className="mx-2"
        />
        <Button type="submit" disabled={!isPosted}>
          Post
        </Button>
      </div>
    </Form>
  );
}
