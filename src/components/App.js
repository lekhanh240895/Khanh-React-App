import React from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import TodoApp from "./TodoApp/TodoApp";
import HackerNewStories from "./HackerNewStoriesApp/HackerNewStories";
import Home from "./Home/Home";
import "./FontAwesome";
import "./App.css";

export const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expands-sm d-flex justify-content-end ">
        <ul className="nav">
          <li className="nav-item">
            <Link to="/" style={{textDecoration: "none"}}>
              <span className="nav-link">Home</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/todo-app" style={{textDecoration: "none"}}>
              <span className="nav-link">Todo App</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/stories-app" style={{textDecoration: "none"}}>
              <span className="nav-link">Hacker News Stories App</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="container-fluid">
        <Switch>
          <Route path="/todo-app">
            <TodoApp />
          </Route>
          <Route path="/stories-app">
            <HackerNewStories />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
