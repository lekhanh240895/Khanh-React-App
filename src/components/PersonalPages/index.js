import React, { useState, useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "./index.css";

import { storage } from "../../firebase/config";
import { ref, getDownloadURL, list } from "firebase/storage";
import useDeviceInfo from "../hooks/useDeviceInfo";
import { useAppContext } from "../../contexts/AppContext";
import { arrayRemove, arrayUnion } from "firebase/firestore";
import { v1 as uuidv1 } from "uuid";

import { Route, useParams, NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Avatar from "./Avatar";
import Pictures from "./Pictures";
import Profile from "../Profile";
import Status from "./Status";
import StatusBar from "./StatusBar";

export default function PersonalPages() {
  const { users, userDocs } = useAppContext();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Navbar variant="dark">
        <Container>
          <h4 className="me-3">People you may know</h4>
          <Nav>
            {users
              .filter((user) => user.email !== userDocs[0]?.email)
              .map((user) => (
                <li key={user.email}>
                  <NavLink to={`/${user.email}`}>
                    <Avatar user={user} />
                  </NavLink>
                </li>
              ))}
          </Nav>
        </Container>
      </Navbar>

      <Route path={`/:profileUid`}>
        <PersonalPage users={users} />
      </Route>
    </div>
  );
}

function PersonalPage({ users }) {
  const { profileUid } = useParams();
  const [isUser, setIsUser] = useState(false);
  const { updateDocument, userDocs } = useAppContext();
  const userProfile = users.find(({ uid }) => uid === profileUid);
  const [status, setStatus] = useState("");
  const [isPosted, setIsPosted] = useState(false);

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

  useEffect(() => {
    if (userDocs[0]?.email === userProfile?.email) {
      setIsUser(true);
    }
  }, [userDocs, userProfile]);

  const [imgUrls, setImgUrls] = useState([]);

  //Load Photos
  const deviceInfo = useDeviceInfo();
  useEffect(() => {
    const loadImg = async () => {
      const listRef = ref(storage, `${userProfile?.email}/Images`);
      let firstPage;

      if (deviceInfo.isMobile) {
        firstPage = await list(listRef, { maxResults: 6 });
      } else if (deviceInfo.isTablet) {
        firstPage = await list(listRef, { maxResults: 9 });
      } else {
        firstPage = await list(listRef, { maxResults: 12 });
      }

      firstPage.items.forEach(async (itemRef) => {
        setImgUrls([]);
        const url = await getDownloadURL(itemRef);
        setImgUrls((prevState) => [...prevState, url]);
      });
    };
    loadImg();
  }, [deviceInfo, userProfile?.email]);

  const handleDeleteStatus = (status) => {
    updateDocument("users", userDocs[0].id, {
      statuses: arrayRemove(status),
    });
  };

  const handleLikeStatus = (status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].isLiked = !status.isLiked;

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleToggleCommentForm = (status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: false,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].isCommentFormOpened = !status.isCommentFormOpened;

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleCloseCommentForm = (status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].isCommentFormOpened = false;

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const onPostComment = async (data, status) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].comments = newStatuses[objIndex].comments.concat({
      content: data.comment,
      commentedAt: new Date(),
      id: uuidv1(),
      isLiked: false,
    });

    await updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleDeleteComment = (status, comment) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    newStatuses[objIndex].comments = newStatuses[objIndex].comments.filter(
      (dbComment) => dbComment.id !== comment.id
    );

    updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  const handleLikeComment = async (status, comment) => {
    let newStatuses = [];
    const objIndex = userDocs[0].statuses.findIndex((e) => e.id === status.id);

    userDocs[0].statuses.forEach((status) => {
      newStatuses.push({
        content: status.content,
        isLiked: status.isLiked,
        id: status.id,
        postedAt: status.postedAt,
        isCommentFormOpened: status.isCommentFormOpened,
        comments: status.comments,
      });
    });

    const newComments = [];
    const commentIndex = status.comments.findIndex((e) => e.id === comment.id);

    status.comments.forEach((dbComment) => {
      newComments.push({
        content: dbComment.content,
        commentedAt: dbComment.commentedAt,
        id: dbComment.id,
        isLiked: dbComment.isLiked,
      });
    });

    newComments[commentIndex].isLiked = !comment.isLiked;

    newStatuses[objIndex].comments = newComments;

    await updateDocument("users", userDocs[0].id, {
      statuses: newStatuses,
    });
  };

  return (
    <Container className="bg-white">
      <Row className="pt-3">
        <Col md>
          <Profile />
          <Pictures imgUrls={imgUrls} user={userProfile} />
        </Col>

        <Col md>
          {isUser && (
            <StatusBar
              userProfile={userProfile}
              imgUrls={imgUrls}
              setImgUrls={setImgUrls}
              handlePostStatus={handlePostStatus}
              handleStatusChange={handleStatusChange}
              isPosted={isPosted}
            />
          )}

          <Status
            userProfile={userProfile}
            isUser={isUser}
            handleDeleteStatus={handleDeleteStatus}
            handleLikeStatus={handleLikeStatus}
            handleToggleCommentForm={handleToggleCommentForm}
            handleLikeComment={handleLikeComment}
            handleDeleteComment={handleDeleteComment}
            onPostComment={onPostComment}
            handleCloseCommentForm={handleCloseCommentForm}
          />
        </Col>
      </Row>
    </Container>
  );
}
