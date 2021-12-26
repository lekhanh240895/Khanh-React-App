import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "./index.css";
import { storage } from "../../firebase/config";
import { ref, getDownloadURL, list } from "firebase/storage";
import useDeviceInfo from "../hooks/useDeviceInfo";
import { useAppContext } from "../../contexts/AppContext";
import { v1 as uuidv1 } from "uuid";

import { Route, useParams, NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import Avatar from "./Avatar";
import Pictures from "./Pictures";
import Profile from "../Profile";
import Status from "./Status";
import StatusBar from "./StatusBar";
import { useRouteMatch } from "react-router-dom";
import Photos from "../Photos";
import useFirestore from "../../components/hooks/useFirestore";
import { find, findIndex, orderBy, reject } from "lodash";

export default function PersonalPages() {
  const { users, userDoc } = useAppContext();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Navbar variant="dark">
        <Container>
          <h3 className="me-3">People you may know</h3>
          <Nav className="pb-2">
            {users
              .filter((user) => user.email !== userDoc?.email)
              .map((user) => (
                <li key={user.email}>
                  <NavLink to={`/${user.email}`}>
                    <Avatar userProfile={user} />
                  </NavLink>
                </li>
              ))}
          </Nav>
        </Container>
      </Navbar>

      <Route path={`/:profileUid`}>
        <PersonalPage users={users} userDoc={userDoc} />
      </Route>
    </div>
  );
}

function PersonalPage({ users, userDoc }) {
  const { profileUid } = useParams();
  const [isUser, setIsUser] = useState(false);
  const { updateDocument, addDocument, delDocument } = useAppContext();
  const userProfile = users.find(({ uid }) => uid === profileUid);

  const [imgUrls, setImgUrls] = useState([]);

  const [status, setStatus] = useState("");
  const [isPosted, setIsPosted] = useState(false);

  const { path } = useRouteMatch();

  useEffect(() => {
    if (userDoc?.email === userProfile?.email) {
      setIsUser(true);
    }
  }, [userDoc, userProfile]);

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

  //Get Statuses
  const condition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: userProfile?.uid,
    };
  }, [userProfile]);

  const statuses = useFirestore("statuses", condition);
  const orderedStatuses = orderBy(statuses, "createdAt", "desc");

  //Status Actions
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
      displayName: userProfile.displayName,
      photoURL: userProfile.photoURL,
      uid: userProfile.uid,
      id: uuidv1(),
      isCommentFormOpened: false,
    });

    setIsPosted(true);
    e.target.reset();
  };

  const handleDeleteStatus = (status) => {
    const selectedStatus = find(orderedStatuses, { id: status.id });

    delDocument("statuses", selectedStatus.id);
  };

  // isUser =>
  /// !isUser =>
  const handleLikeStatus = (status) => {
    const selectedStatus = find(orderedStatuses, { id: status.id });
    const { displayName, photoURL } = userDoc;

    if (isUser) {
      if (!selectedStatus.isLikedByUser) {
        updateDocument("statuses", selectedStatus.id, {
          isLikedByUser: !status.isLikedByUser,
          likedPeople: selectedStatus.likedPeople.concat({
            displayName,
            photoURL,
          }),
        });
      } else {
        updateDocument("statuses", selectedStatus.id, {
          isLikedByUser: !status.isLikedByUser,
          likedPeople: reject(selectedStatus.likedPeople, {
            displayName,
            photoURL,
          }),
        });
      }
    } else {
      if (!selectedStatus.isLiked) {
        updateDocument("statuses", selectedStatus.id, {
          isLiked: !status.isLiked,
          likedPeople: selectedStatus.likedPeople.concat({
            displayName,
            photoURL,
          }),
        });
      } else {
        updateDocument("statuses", selectedStatus.id, {
          isLiked: !status.isLiked,
          likedPeople: reject(selectedStatus.likedPeople, {
            displayName,
            photoURL,
          }),
        });
      }
    }
  };

  //Comment
  const handleToggleCommentForm = (status) => {
    const selectedStatus = find(orderedStatuses, { id: status.id });

    updateDocument("statuses", selectedStatus.id, {
      isCommentFormOpened: !status.isCommentFormOpened,
    });
  };

  const handleCloseCommentForm = (status) => {
    const selectedStatus = find(orderedStatuses, { id: status.id });

    updateDocument("statuses", selectedStatus.id, {
      isCommentFormOpened: false,
    });
  };

  const onPostComment = async (data, status) => {
    const selectedStatus = find(orderedStatuses, { id: status.id });

    await updateDocument("statuses", selectedStatus.id, {
      comments: selectedStatus.comments.concat({
        content: data.comment,
        commentedAt: new Date(),
        id: uuidv1(),
        isLiked: false,
        commentUserProfile: userDoc,
      }),
    });
  };

  const handleDeleteComment = (status, comment) => {
    const selectedStatus = find(orderedStatuses, { id: status.id });

    updateDocument("statuses", selectedStatus.id, {
      comments: reject(status.comments, comment),
    });
  };

  const handleLikeComment = async (status, comment) => {
    const selectedStatus = find(orderedStatuses, { id: status.id });

    const selectedCommentIndex = findIndex(status.comments, { id: comment.id });

    const newComments = [];

    status.comments.forEach((dbComment) => {
      newComments.push({
        content: dbComment.content,
        commentedAt: dbComment.commentedAt,
        id: dbComment.id,
        isLiked: dbComment.isLiked,
        commentUserProfile: dbComment.commentUserProfile,
      });
    });

    newComments[selectedCommentIndex].isLiked = !comment.isLiked;
    console.log({ newComments });
    updateDocument("statuses", selectedStatus.id, {
      comments: newComments,
    });
  };

  return (
    <Container className="bg-white">
      {userProfile && (
        <Row className="pt-3">
          <Col md>
            <Profile isUser={isUser} user={userProfile} />
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
              statuses={orderedStatuses}
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
      )}

      <Route path={`${path}/photos`}>
        <Photos user={userProfile} />
      </Route>
    </Container>
  );
}
