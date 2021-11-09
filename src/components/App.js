import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//Import Components
import NoMatch from "./NoMatch";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";
import Topics from "./Topics";
import TodoApp from "./TodoApp";
import HackerNewStories from "./HackerNewStoriesApp";
import Profile from "./Profile";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "../components/PrivateRoute/index";
import NavigationBar from "./NavigationBar";
import ForgotPassWord from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Homepage from "./Homepage";

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
        return window.addEventListener("onload", setShowNavbar(true));
      }, 2000);
    }
    setShowNavbar(false);
  }, [user]);

  const handleSignOut = async () => {
    if (user) {
      try {
        await logout(auth);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <Router>
      {showNavbar && <NavigationBar handleSignOut={handleSignOut} />}

      <Container>
        <AuthProvider>
          <AppProvider>
            <Switch>
              <PrivateRoute exact path="/">
                <Homepage />
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

              <Route path="/update-profile">
                <UpdateProfile />
              </Route>

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
