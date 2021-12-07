import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";
import { arrayUnion /* arrayRemove */ } from "firebase/firestore";
import { v1 as uuidv1 } from "uuid";
import Avatar from "../Avatar";

export default function StatusForm({ user }) {
  const [status, setStatus] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const { userDocs, updateDocument } = useAppContext();

  const handlePostStatus = async (e) => {
    e.preventDefault();
    setIsPosted(false);

    await updateDocument("users", userDocs[0].id, {
      statuses: arrayUnion({
        content: status,
        isLiked: false,
        /*     numOfLikes: 0, */
        id: uuidv1(),
        postedAt: new Date(),
        isCommentFormOpened: false,
        comments: [],
      }),
    });

    setIsPosted(true);
    e.target.reset();
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setIsPosted(true);
  };

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
