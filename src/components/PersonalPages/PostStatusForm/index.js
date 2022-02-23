import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import UserAvatar from "../UserAvatar";
import { useAppContext } from "../../../contexts/AppContext";
import { v1 as uuidv1 } from "uuid";

export default function PostStatusForm({ userProfile }) {
  const [status, setStatus] = useState("");

  const { addDocument, userDoc } = useAppContext();
  const isUser = userDoc?.email === userProfile?.email;

  //Post Status
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handlePostStatus = async (e) => {
    e.preventDefault();

    await addDocument("statuses", {
      content: status,
      likedPeople: [],
      postedAt: new Date(),
      comments: [],
      uid: userProfile?.uid,
      displayName: userProfile?.displayName,
      photoURL: userProfile?.photoURL,
      email: userProfile?.email,
      postUid: userDoc?.uid,
      postDisplayName: userDoc?.displayName,
      postPhotoURL: userDoc?.photoURL,
      postEmail: userDoc?.email,
      id: uuidv1(),
      isCommentTabOpened: true,
    });

    e.target.reset();
  };
  return (
    <Form onSubmit={handlePostStatus}>
      <div className="d-flex align-items-center justify-content-between px-3">
        <div>
          <UserAvatar
            email={userDoc?.email}
            photoURL={userDoc?.photoURL}
            width="50px"
            height="50px"
            textSize="30px"
          >
            {userDoc?.displayName.charAt(0)}
          </UserAvatar>
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
          }}
          onChange={(e) => handleStatusChange(e)}
          className="mx-2"
          required
        />

        <Button type="submit">Post</Button>
      </div>
    </Form>
  );
}
