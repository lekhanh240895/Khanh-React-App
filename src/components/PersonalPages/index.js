import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "./index.css";
// import { storage } from "../../firebase/config";
// import { ref, getDownloadURL, list } from "firebase/storage";
import useDeviceInfo from "../hooks/useDeviceInfo";
import { useAppContext } from "../../contexts/AppContext";
import Pictures from "./Pictures";
import Statuses from "./Statuses";
import StatusBar from "./StatusBar";
import useFirestore from "../../components/hooks/useFirestore";
import { orderBy } from "lodash";
import Friends from "./Friends/index";
import Profile from "./Profile/index";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Post from "./Post/index";
import UserPhotos from "./UserPhotos";

export default function PersonalPage({ userProfile }) {
  const { isUser, users, userDoc, setIsUser } = useAppContext();
  const [imgUrls, setImgUrls] = useState([]);
  const { path } = useRouteMatch();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (userDoc?.email === userProfile?.email) {
      return setIsUser(true);
    }

    setIsUser(false);

    return () => setIsUser(false);
  }, [userDoc, userProfile, setIsUser]);

  const { statuses } = useAppContext();

  //Load Photos
  // const deviceInfo = useDeviceInfo();

  // useEffect(() => {
  //   setImgUrls([]);

  //   const loadImg = async () => {
  //     const listRef = ref(storage, `${userProfile?.email}/Images/Statuses`);
  //     let firstPage;

  //     if (deviceInfo.isMobile) {
  //       firstPage = await list(listRef, { maxResults: 6 });
  //     } else if (deviceInfo.isTablet) {
  //       firstPage = await list(listRef, { maxResults: 9 });
  //     } else {
  //       firstPage = await list(listRef, { maxResults: 12 });
  //     }

  //     firstPage.items.forEach(async (itemRef) => {
  //       const url = await getDownloadURL(itemRef);
  //       setImgUrls((prevState) => [...prevState, url]);
  //     });
  //   };

  //   loadImg();

  //   return () => {
  //     setImgUrls([]);
  //   };
  // }, [deviceInfo, userProfile?.email]);

  const deviceInfo = useDeviceInfo();

  useEffect(() => {
    const userPhotoStatuses = statuses.filter(
      (status) =>
        status.postUid === userProfile?.uid && status.attachments.length > 0
    );

    const orderUserPhotoStatuses = orderBy(
      userPhotoStatuses,
      "createdAt",
      "desc"
    );

    const userImages = orderUserPhotoStatuses.reduce((acc, cur) => {
      return acc.concat(cur.attachments);
    }, []);

    if (userImages.length > 0) {
      if (deviceInfo.isMobile) {
        setImgUrls(userImages.slice(0, 6));
      } else if (deviceInfo.isTablet) {
        setImgUrls(userImages.slice(0, 9));
      } else {
        setImgUrls(userImages.slice(0, 12));
      }
    } else {
      setImgUrls([]);
    }
  }, [deviceInfo, statuses, userProfile?.uid]);

  //Get User Statuses
  const condition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "==",
      compareValue: userProfile?.uid,
    };
  }, [userProfile]);
  const userStatuses = useFirestore("statuses", condition);
  const orderedStatuses = orderBy(userStatuses, "createdAt", "desc");

  if (!userProfile) return null;

  return (
    <Switch>
      <Route exact path={path}>
        <Container className="bg-white">
          <Row className="pt-3">
            <Col md className="user-info">
              <Profile isUser={isUser} user={userProfile} />
              <Pictures imgUrls={imgUrls} user={userProfile} />
              <Friends users={users} userProfile={userProfile} />
            </Col>

            <Col md>
              <StatusBar userProfile={userProfile} />

              <Statuses statuses={orderedStatuses} />
            </Col>
          </Row>
        </Container>
      </Route>

      <Route path={`/:email/posts/:postId`}>
        <Post />
      </Route>

      <Route path={`/:email/photos`}>
        <UserPhotos />
      </Route>
    </Switch>
  );
}
