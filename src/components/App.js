import React, { useState } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Import Components
import NavigationBar from "./NavigationBar";
import NoMatch from "./NoMatch";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";

//Other Projects
import TodoApp from "./TodoApp";
import HackerNewStories from "./HackerNewStoriesApp";

//A like Facebook App Project
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "../components/PrivateRoute/index";
import ForgotPassWord from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import CustomPrompt from "../components/Custom-Prompt/index.js";

//Styles
import "./FontAwesome";
import "./App.css";
import { Container } from "react-bootstrap";

//Firebase tools
import { useAppContext } from "../contexts/AppContext";

import Homepage from "./Homepage/index";
import PersonalPage from "../components/PersonalPages/index";
import ChatRoom from "./ChatRoom";
import AddRoomModal from "./Modals/AddRoomModal";
import InviteMemberModal from "./Modals/InviteMemberModal";
import ChatIcon from "./ChatIcon";
import { useAuth } from "../contexts/AuthContext";

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
          {users?.map((user) => (
            <PrivateRoute path={`/${user.email}`} key={user.email}>
              <PersonalPage userProfile={user} />
            </PrivateRoute>
          ))}

          <PrivateRoute exact path="/">
            <Homepage />
          </PrivateRoute>

          <PrivateRoute path="/todo-app">
            <TodoApp />
          </PrivateRoute>

          <PrivateRoute path="/stories-app">
            <HackerNewStories />
          </PrivateRoute>

          <Route path="/login">
            <Login />
          </Route>

          <Route path="/signup">
            <SignUp />
          </Route>

          <Route path="/forgot-password">
            <ForgotPassWord />
          </Route>

          <PrivateRoute path="/update-profile">
            <UpdateProfile />
          </PrivateRoute>

          <PrivateRoute path="/messages">
            <ChatRoom />
          </PrivateRoute>

          <PrivateRoute path="*">
            <NoMatch />
          </PrivateRoute>
        </Switch>
        <AddRoomModal />
        <InviteMemberModal />

        {user && <ChatIcon />}
        <ScrollTopArrow />
      </Container>
    </Router>
  );
};

export default App;
