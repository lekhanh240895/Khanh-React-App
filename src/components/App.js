import React, { useState, useEffect } from "react";
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
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import ForgotPassWord from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import Topics from "./Topics";
import NoMatch from "./NoMatch";
import { AppProvider } from "../contexts/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase/config";
import styled from "styled-components";

const StyledNavLink = styled.li`
  font-size: 20px;
  display: inline-block;
  padding: 0.5rem;
`;

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
      {showNavbar && (
        <Navbar
          expand="md"
          variant="dark"
          className="d-flex justify-content-start"
        >
          <Container fluid>
            <Navbar.Brand>
              <FontAwesomeIcon className="me-2" icon={["fab", "react"]} />
              My React App
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-5">
                <StyledNavLink>
                  <NavLink
                    exact
                    to="/"
                    className=""
                    activeClassName="text-white"
                  >
                    Home
                  </NavLink>
                </StyledNavLink>

                <StyledNavLink className="">
                  <NavLink
                    to="/todo-app"
                    className=""
                    activeClassName="text-white"
                  >
                    Todo App
                  </NavLink>
                </StyledNavLink>

                <StyledNavLink className="">
                  <NavLink
                    to="/stories-app"
                    className=""
                    activeClassName="text-white"
                  >
                    Hacker News Stories App
                  </NavLink>
                </StyledNavLink>

                <StyledNavLink className="">
                  <NavLink
                    to="/topics"
                    className=""
                    activeClassName="text-white"
                  >
                    Topics
                  </NavLink>
                </StyledNavLink>

                <NavDropdown
                  title={<FontAwesomeIcon icon={["fas", "cog"]} size="sm" />}
                  id="basic-nav-dropdown"
                >
                  <div className="m-0 px-1">
                    <Button
                      variant="outline-primary"
                      style={{ border: "none" }}
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </div>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}

      <Container>
        <AuthProvider>
          <AppProvider>
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
          </AppProvider>
        </AuthProvider>

        <ScrollTopArrow />
      </Container>
    </Router>
  );
};

export default App;
