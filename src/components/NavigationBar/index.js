import React from "react";
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./index.css";

export default function NavigationBar({ handleSignOut }) {
  const { user } = useAuth();

  return (
    <Navbar expand="md" bg="dark" variant="dark" className="mb-4">
      <Container fluid>
        <Navbar.Brand>
          <NavLink exact to={"/"} activeClassName="text-white">
            <FontAwesomeIcon
              icon={["fas", "home"]}
              style={{ width: "30px", height: "30px" }}
            />
          </NavLink>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FontAwesomeIcon icon={["fas", "bars"]} />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <NavLink
              to={`/${user?.email}`}
              activeClassName="text-white"
              className="mx-2"
            >
              <div className="d-flex align-items-center">
                <Image
                  src={user?.photoURL}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <span className="ms-2">{user?.displayName}</span>
              </div>
            </NavLink>

            <NavLink
              to="/todo-app"
              activeClassName="text-white"
              className="mx-2 py-1"
            >
              Todo App
            </NavLink>

            <NavLink
              to="/stories-app"
              activeClassName="text-white"
              className="mx-2 py-1"
            >
              Hacker News Stories App
            </NavLink>

            <NavLink
              to="/topics"
              activeClassName="text-white"
              className="mx-2 py-1"
            >
              Topics
            </NavLink>

            <NavDropdown id="basic-nav-dropdown">
              <NavDropdown.Item>
                <span
                  style={{ border: "none", color: "#000" }}
                  onClick={handleSignOut}
                >
                  Sign out
                </span>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
