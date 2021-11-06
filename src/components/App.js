import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  NavLink,
} from "react-router-dom";
import TodoApp from "./TodoApp";
import HackerNewStories from "./HackerNewStoriesApp";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import PrivateRoute from "./PrivateRoute";
import "./FontAwesome";
import "./App.css";
import ScrollTopArrow from "./ScrollTopArrow/ScrollTopArrow";
import { Navbar, Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import ForgotPassWord from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Topics from "./Topics";
import NoMatch from "./NoMatch";

export const App = () => {
  return (
    <Router>
      <Navbar className="d-flex justify-content-end">
        <ul className="nav">
          <li className="nav-item">
            <NavLink
              exact
              to="/"
              className="nav-link"
              activeClassName="text-white"
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/todo-app"
              className="nav-link"
              activeClassName="text-white"
            >
              Todo App
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/stories-app"
              className="nav-link"
              activeClassName="text-white"
            >
              Hacker News Stories App
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/topics"
              className="nav-link"
              activeClassName="text-white"
            >
              Topics
            </NavLink>
          </li>
        </ul>
      </Navbar>
      <Container>
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

            <PrivateRoute path="/topics">
              <Topics />
            </PrivateRoute>

            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
        </AuthProvider>

        <ScrollTopArrow />
      </Container>
    </Router>
  );
};

export default App;
