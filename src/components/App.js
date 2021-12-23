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
import Profile from "../components/Profile/index.js";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "../components/PrivateRoute/index";
import ForgotPassWord from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import PersonalPages from "../components/PersonalPages/index";
import CustomPrompt from "../components/Custom-Prompt/index.js";

//Styles
import "./FontAwesome";
import "./App.css";
import { Container } from "react-bootstrap";

//Firebase tools
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { AppProvider, useAppContext } from "../contexts/AppContext";
import { auth } from "../firebase/config";

export const App = () => {
  const { user, logout } = useAuth();
  const [showNavbar, setShowNavbar] = useState(false);
  const { users } = useAppContext();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        return setShowNavbar(true);
      }, 1000);
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
                  <PersonalPages />
                </PrivateRoute>
              ))}

              <PrivateRoute exact path="/">
                <h1>Hello World</h1>
              </PrivateRoute>

              <PrivateRoute path="/profile">
                <Profile />
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

              <Route path="*">
                <NoMatch />
              </Route>
            </Switch>
          </AppProvider>
        </AuthProvider>

        <ScrollTopArrow />
      </Container>
    </Router>
  );
};

export default App;
