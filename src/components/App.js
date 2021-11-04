import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import TodoApp from "./TodoApp";
import HackerNewStories from "./HackerNewStoriesApp";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import "./FontAwesome";
import "./App.css";
import ScrollTopArrow from "./ScrollTopArrow";
import { Navbar, Alert } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import ForgotPassWord from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Topics from "./topics";

export const App = () => {
  return (
    <Router>
      <Navbar className="d-flex justify-content-end ">
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" style={{ textDecoration: "none" }}>
              <span className="nav-link">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/todo-app" style={{ textDecoration: "none" }}>
              <span className="nav-link">Todo App</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/stories-app" style={{ textDecoration: "none" }}>
              <span className="nav-link">Hacker News Stories App</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/topics" style={{ textDecoration: "none" }}>
              <span className="nav-link">Topics</span>
            </Link>
          </li>
        </ul>
      </Navbar>

      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <Home />
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

          <Route path="/topics">
            <Topics />
          </Route>

          <Route path="*">
            <Alert variant="danger" className="text-center">
              Nothing to do here!
            </Alert>
          </Route>
        </Switch>
      </AuthProvider>

      <ScrollTopArrow />
    </Router>
  );
};

export default App;
