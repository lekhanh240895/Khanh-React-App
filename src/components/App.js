import React, { useState } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Other Projects
import WorkCalendar from "./WorkCalendar";

//Other Components
import CustomPrompt from "../components/Custom-Prompt/index.js";
import PrivateRoute from "../components/PrivateRoute/index";
import ChatIcon from "./ChatIcon";
import NavigationBar from "./NavigationBar";
import NoMatch from "./NoMatch";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";

//A Facebook-alike App Project
import Login from "../components/Account/Login/index";
import SignUp from "../components/Account/SignUp/index.js";
import ForgotPassWord from "../components/Account/ForgotPassword/index";
import UpdateProfile from "./PersonalPages/UpdateProfile";
import PersonalPage from "../components/PersonalPages/index";
import ChatRoom from "./ChatRoom";
import Photo from "../components/PersonalPages/Photo/index";
import Homepage from "../components/Homepage";

//Styles
import "./FontAwesome";
import { Container } from "react-bootstrap";

//Firebase tools
import { useAppContext } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";

//Modals
import AddRoomModal from "./Modals/AddRoomModal";
import InviteMemberModal from "./Modals/InviteMemberModal";
import WorkTimesheetModal from "./Modals/WorkTimesheetModal";
import UploadImageChatModal from "./Modals/UploadImageChatModal";
import UploadImageStatusModal from "./Modals/UploadImageStatusModal";
import UploadImageCommentModal from "./Modals/UploadImageCommentModal";
import UploadAvatarModal from "./Modals/UploadAvatarModal";
import EditPostModal from "./Modals/EditPostModal";

export const App = () => {
  const { users } = useAppContext();
  const { user } = useAuth();
  const [show, setShow] = useState(true);

  return (
    <Router
      getUserConfirmation={(message, callback) => {
        return CustomPrompt(message, callback, show, setShow);
      }}
    >
      <NavigationBar />

      <Container style={{ marginTop: 60, padding: 20 }}>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>

          <Route path="/signup">
            <SignUp />
          </Route>

          <Route path="/forgot-password">
            <ForgotPassWord />
          </Route>

          {users?.map((user) => (
            <PrivateRoute path={`/${user.email}`} key={user.email}>
              <PersonalPage userProfile={user} />
            </PrivateRoute>
          ))}

          <PrivateRoute path={`/photo/:photoId`}>
            <Photo />
          </PrivateRoute>

          <PrivateRoute exact path="/">
            <Homepage />
          </PrivateRoute>

          <PrivateRoute path="/update-profile">
            <UpdateProfile />
          </PrivateRoute>

          <PrivateRoute path="/work-calendar">
            <WorkCalendar />
          </PrivateRoute>

          <PrivateRoute path="/messages">
            <ChatRoom />
          </PrivateRoute>

          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>

        <AddRoomModal />
        <InviteMemberModal />
        <WorkTimesheetModal />
        <UploadImageChatModal />
        <UploadImageStatusModal />
        <UploadImageCommentModal />
        <UploadAvatarModal />
        <EditPostModal />

        {user && <ChatIcon />}
        <ScrollTopArrow />
      </Container>
    </Router>
  );
};

export default App;
