import React from "react";
import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const StyledNavLink = styled.li`
  font-size: 20px;
  display: inline-block;
  padding: 0.5rem;
`;

export default function NavigationBar({ handleSignOut }) {
  const { user } = useAuth();

  return (
    <Navbar
      expand="md"
      variant=""
      style={{
        background: "#0b3d6b",
        marginBottom: "1rem",
      }}
    >
      <Container fluid>
        <Navbar.Brand>
          <NavLink to={`/${user?.email}`} activeClassName="text-white">
            <FontAwesomeIcon
              className="me-2 "
              icon={["fab", "react"]}
              size="lg"
            />
          </NavLink>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <FontAwesomeIcon icon={["fas", "bars"]} className="text-white" />
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <StyledNavLink>
              <NavLink to="/profile" activeClassName="text-white">
                Profile
              </NavLink>
            </StyledNavLink>

            <StyledNavLink>
              <NavLink to="/todo-app" activeClassName="text-white">
                Todo App
              </NavLink>
            </StyledNavLink>

            <StyledNavLink>
              <NavLink to="/stories-app" activeClassName="text-white">
                Hacker News Stories App
              </NavLink>
            </StyledNavLink>

            <StyledNavLink>
              <NavLink to="/topics" activeClassName="text-white">
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
  );
}
