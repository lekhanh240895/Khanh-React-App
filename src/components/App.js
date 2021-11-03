import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import TodoApp from "./TodoApp";
import HackerNewStories from "./HackerNewStoriesApp";
import Home from "./Home";
import Login from "./Login";
import SignUp from "./SignUp";
import "./FontAwesome";
import "./App.css";
import ScrollTopArrow from "./ScrollTopArrow";
import { Navbar } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";

export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar className="d-flex justify-content-end ">
          <ul className="nav">
            <li className="nav-item">
              <Link to="/" style={{ textDecoration: "none" }}>
                <span className="nav-link">Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" style={{ textDecoration: "none" }}>
                <span className="nav-link">Login</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/sign-up" style={{ textDecoration: "none" }}>
                <span className="nav-link">Sign Up</span>
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
          </ul>
        </Navbar>

        <Switch>
          <Route path="/todo-app">
            <TodoApp />
          </Route>
          <Route path="/stories-app">
            <HackerNewStories />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route path="/sign-up">
            <SignUp />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>

        <ScrollTopArrow />
      </Router>
    </AuthProvider>
  );
};

export default App;
