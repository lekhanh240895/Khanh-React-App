import React, { useState } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Import Components
import NavigationBar from "./NavigationBar";
import NoMatch from "./NoMatch";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";

//Other Projects
import HackerNewStories from "./HackerNewStoriesApp";
import TodoAppRedux from "./TodoAppRedux";
import CovidApp from "./CovidApp";
import TodoApp from "./TodoApp";
import WorkCalendar from "./WorkCalendar";

//A Facebook-alike App Project
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "../components/PrivateRoute/index";
import ForgotPassWord from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import CustomPrompt from "../components/Custom-Prompt/index.js";
import Homepage from "./Homepage/index";
import PersonalPage from "../components/PersonalPages/index";
import ChatRoom from "./ChatRoom";

import ChatIcon from "./ChatIcon";

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

          {users?.map((user) => (
            <PrivateRoute path={`/${user.email}`} key={user.email}>
              <PersonalPage userProfile={user} />
            </PrivateRoute>
          ))}

          <PrivateRoute exact path="/">
            <Homepage />
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

          <PrivateRoute path="/update-profile">
            <UpdateProfile />
          </PrivateRoute>

          <PrivateRoute path="/messages">
            <ChatRoom />
          </PrivateRoute>

          <PrivateRoute path="/work-calendar">
            <WorkCalendar />
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

        {user && <ChatIcon />}
        <ScrollTopArrow />
      </Container>
    </Router>
  );
};

export default App;
