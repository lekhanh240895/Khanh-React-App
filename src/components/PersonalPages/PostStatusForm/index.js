import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Avatar from "../Avatar";
import { useAppContext } from "../../../contexts/AppContext";
import { v1 as uuidv1 } from "uuid";

export default function PostStatusForm({ userProfile }) {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addDocument, userDoc } = useAppContext();
  const isUser = userDoc?.email === userProfile?.email;

  //Post Status
  const handleStatusChange = (e) => {
    if (e.target.value) {
      setIsLoading(true);
      setStatus(e.target.value);
    } else {
      setIsLoading(false);
    }
  };

  const handlePostStatus = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await addDocument("statuses", {
      content: status,
      likedPeople: [],
      postedAt: new Date(),
      comments: [],
      postStatusUserProfile: userDoc,
      email: userProfile.email,
      userProfile: userProfile,
      id: uuidv1(),
      isCommentTabOpened: true,
    });
    setIsLoading(false);
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

        <Button type="submit" disabled={!isLoading}>
          Post
        </Button>
      </div>
    </Form>
  );
}
