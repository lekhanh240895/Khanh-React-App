import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Import Components
import NoMatch from "./NoMatch";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";
import Topics from "./Topics";
import TodoApp from "./TodoApp";
import HackerNewStories from "./HackerNewStoriesApp";
/* import ProfilePage from "../components/ProfilePage/index"; */
import Profile from "../components/Profile/index.js";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "../components/PrivateRoute/index";
import NavigationBar from "./NavigationBar";
import ForgotPassWord from "./ForgotPassword"; /*  */
import UpdateProfile from "./UpdateProfile";
/* import Homepage from "./Homepage"; */
import { Homepages } from "../components/Homepage/Homepage.js";
import Photos from "./Photos";

/* import CustomPrompt from "./CustomPrompt/index"; */
import CustomPrompt from "../components/Custom-Prompt/index.js";

//Import Styles
import "./FontAwesome";
import "./App.css";
import { Container } from "react-bootstrap";
//Import Firebase tools
import { AuthProvider } from "../contexts/AuthContext";
import { AppProvider } from "../contexts/AppContext";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config";
import "moment-timezone";
import { useAppContext } from "../contexts/AppContext";

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
                  <Homepages />
                </PrivateRoute>
              ))}

              <PrivateRoute exact path="/photos">
                <Photos />
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
