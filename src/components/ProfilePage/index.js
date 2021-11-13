import React from "react";
import { Modal } from "react-bootstrap";
import { useHistory, Route } from "react-router-dom";

import Profile from "./Profile/index.js";
import UpdateProfile from "./UpdateProfile/index.js";

export const ProfilePage = () => {
  const history = useHistory();
  return (
    <>
      <Route path="/profile">
        <Profile />
      </Route>

      <Route
        path="/profile/update-profile"
        children={({ match }) => {
          return (
            <Modal show={Boolean(match)} onHide={history.goBack}>
              <UpdateProfile />
            </Modal>
          );
        }}
      />
    </>
  );
};

export default ProfilePage;
