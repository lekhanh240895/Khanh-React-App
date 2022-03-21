import React, { useState } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//Other Projects
import HackerNewStories from "./HackerNewStoriesApp";
import TodoAppRedux from "./TodoAppRedux";
import CovidApp from "./CovidApp";
import TodoApp from "./TodoApp";
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
import Homepage from "../components/PersonalPages/Homepage/index.js";
import PersonalPage from "../components/PersonalPages/index";
import ChatRoom from "./ChatRoom";
import UserPhotos from "./PersonalPages/UserPhotos/index";
import Photo from "../components/PersonalPages/Photo/index";

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

//Test
import Post from "./PersonalPages/Post";

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

      <Container>
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

          <PrivateRoute path={`/${user.email}/posts/:postId`}>
            <Post />
          </PrivateRoute>

          <PrivateRoute path={`/photo/:photoId`}>
            <Photo />
          </PrivateRoute>

          <PrivateRoute exact path="/">
            <Homepage />
          </PrivateRoute>

          <PrivateRoute path="/update-profile">
            <UpdateProfile />
          </PrivateRoute>

          {users?.map((user) => (
            <PrivateRoute path={`/${user.email}`} key={user.email}>
              <PersonalPage userProfile={user} />
            </PrivateRoute>
          ))}

          {users?.map((user) => (
            <PrivateRoute path={`/${user.email}-photos`} key={user.email}>
              <UserPhotos userProfile={user} />
            </PrivateRoute>
          ))}

          <PrivateRoute path="/work-calendar">
            <WorkCalendar />
          </PrivateRoute>

          <PrivateRoute path="/todo-app-redux">
            <TodoAppRedux />
          </PrivateRoute>

          <PrivateRoute path="/todo-app">
            <TodoApp />
          </PrivateRoute>

          <PrivateRoute path="/stories-app">
            <HackerNewStories />
          </PrivateRoute>

          <PrivateRoute path="/messages">
            <ChatRoom />
          </PrivateRoute>

          <PrivateRoute path="/covid-app">
            <CovidApp />
          </PrivateRoute>

          <PrivateRoute path="*">
            <NoMatch />
          </PrivateRoute>
        </Switch>
        <AddRoomModal />
        <InviteMemberModal />
        <WorkTimesheetModal />
        <UploadImageChatModal />
        <UploadImageStatusModal />
        <UploadImageCommentModal />
        <UploadAvatarModal />

        {user && <ChatIcon />}
        <ScrollTopArrow />
      </Container>
    </Router>
  );
};

export default App;
