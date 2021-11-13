import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Import Components
import NoMatch from "./NoMatch";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";
import Topics from "./Topics";
import TodoApp from "./TodoApp";
import HackerNewStories from "./HackerNewStoriesApp";
import ProfilePage from "../components/ProfilePage/index";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "../components/PrivateRoute/index";
import NavigationBar from "./NavigationBar";
import ForgotPassWord from "./ForgotPassword"; /*  */
import UpdateProfile from "./UpdateProfile";
import Homepage from "./Homepage";


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

export const App = () => {
  const { user, logout } = useAuth();
  const [showNavbar, setShowNavbar] = useState(false);

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
              <PrivateRoute exact path="/">
                <Homepage />
              </PrivateRoute>

              <PrivateRoute path="/profile">
                <ProfilePage />
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
