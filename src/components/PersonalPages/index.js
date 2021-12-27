import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Container } from "react-bootstrap";
import "./index.css";
import { storage } from "../../firebase/config";
import { ref, getDownloadURL, list } from "firebase/storage";
import useDeviceInfo from "../hooks/useDeviceInfo";
import { useAppContext } from "../../contexts/AppContext";
import { Route } from "react-router-dom";
import Pictures from "./Pictures";
import Profile from "../Profile";
import Statuses from "./Statuses";
import StatusBar from "./StatusBar";
import { useRouteMatch } from "react-router-dom";
import Photos from "../Photos";
import useFirestore from "../../components/hooks/useFirestore";
import { orderBy } from "lodash";
import Friends from "../Friends";

export default function PersonalPage({ userProfile }) {
  const [isUser, setIsUser] = useState(false);
  const { users, userDoc } = useAppContext();
  const [imgUrls, setImgUrls] = useState([]);
  const { path } = useRouteMatch();

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

  console.log("UserStatus", { orderedStatuses });

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

  return (
    <Container className="bg-white">
      {userProfile && (
        <Row className="pt-3">
          <Col md>
            <Profile isUser={isUser} user={userProfile} />
            <Pictures imgUrls={imgUrls} user={userProfile} />
            <Friends users={users} userProfile={userProfile} />
          </Col>

          <Col md>
            <StatusBar
              userProfile={userProfile}
              imgUrls={imgUrls}
              setImgUrls={setImgUrls}
            />

            <Statuses
              isUser={isUser}
              statuses={orderedStatuses}
              userProfile={userProfile}
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
