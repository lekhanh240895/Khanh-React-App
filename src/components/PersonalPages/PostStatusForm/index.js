import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Avatar from "../Avatar";
import { useAppContext } from "../../../contexts/AppContext";
import { v1 as uuidv1 } from "uuid";

export default function PostStatusForm({ userProfile }) {
  const [status, setStatus] = useState("");
  const [isPosted, setIsPosted] = useState(false);
  const { addDocument, userDoc } = useAppContext();
  const isUser = userDoc?.email === userProfile?.email;

  //Post Status
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setIsPosted(true);
  };

  const handlePostStatus = async (e) => {
    e.preventDefault();
    setIsPosted(false);

    await addDocument("statuses", {
      content: status,
      isLiked: false,
      isLikedByUser: false,
      likedPeople: [],
      postedAt: new Date(),
      comments: [],
      email: userDoc.email,
      displayName: userDoc.displayName,
      photoURL: userDoc.photoURL,
      uid: userProfile.uid,
      id: uuidv1(),
      isCommentFormOpened: false,
    });

    setIsPosted(true);
    e.target.reset();
  };
  return (
    <Form onSubmit={handlePostStatus}>
      <div className="d-flex align-items-center justify-content-between px-3">
        <div>
          <Avatar userProfile={userDoc} />
        </div>

        <Form.Control
          type="text"
          placeholder={
            isUser
              ? "What are you thinking?"
              : `What do you want to say to ${userProfile.displayName}`
          }
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
