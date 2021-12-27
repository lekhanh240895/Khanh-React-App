import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Import Components
import NavigationBar from "./NavigationBar";
import NoMatch from "./NoMatch";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";

//Other Projects
import Topics from "./Topics";
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
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { AppProvider, useAppContext } from "../contexts/AppContext";
import { auth } from "../firebase/config";
import ChatIcon from "./ChatIcon";
import ChatWindow from "./ChatWindow";
import Homepage from "./Homepage/index";
import PersonalPage from "../components/PersonalPages/index";

export const App = () => {
  const { user, logout } = useAuth();
  const [showNavbar, setShowNavbar] = useState(false);
  const { users } = useAppContext();

  useEffect(() => {
    if (user) {
      return setShowNavbar(true);
    }

    setShowNavbar(false);
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logout(auth);
    } catch (error) {
      console.log(error.message);
    }
  };

  const [show, setShow] = useState(true);

  return (
    <Router
      getUserConfirmation={(message, callback) => {
        return CustomPrompt(message, callback, show, setShow);
      }}
    >
      {showNavbar && <NavigationBar handleSignOut={handleSignOut} />}

      <Container>
        <AuthProvider>
          <AppProvider>
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

              <PrivateRoute path="/topics">
                <Topics />
              </PrivateRoute>

              <PrivateRoute path="/messages">
                <ChatWindow />
              </PrivateRoute>

              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
          </AppProvider>
        </AuthProvider>

        <ScrollTopArrow />
        <ChatIcon />
      </Container>
    </Router>
  );
};

export default App;
