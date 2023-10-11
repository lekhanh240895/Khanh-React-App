import React from "react";
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import { auth } from "../../firebase/config";
import "./index.css";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { serverTimestamp } from "firebase/firestore";
import SearchUserForm from "../SearchUserForm";

export default function NavigationBar() {
  const { user, logout } = useAuth();
  const { setShowChatSidebar, userDoc, updateDocument } = useAppContext();

  const handleSignOut = async () => {
    await logout(auth);
    updateDocument("users", userDoc.id, {
      isOnline: false,
      lastOnline: serverTimestamp(),
    });
  };

  return (
    <>
      {user && (
        <Navbar
          expand="md"
          className="navbar"
          fixed="top"
          style={{ height: 60 }}
        >
          <Container fluid>
            <Navbar.Brand>
              <NavLink exact to={"/"} activeClassName="active-link-icon">
                <FontAwesomeIcon
                  icon={["fab", "korvue"]}
                  style={{ width: "40px", height: "40px" }}
                />
              </NavLink>
            </Navbar.Brand>

            <Navbar.Brand>
              <NavLink
                to="/messages"
                activeClassName="active-link-icon"
                onClick={() => setShowChatSidebar(true)}
              >
                <FontAwesomeIcon
                  icon={faFacebookMessenger}
                  style={{ width: "40px", height: "40px" }}
                />
              </NavLink>
            </Navbar.Brand>

            <Navbar.Brand>
              <NavLink to="/work-calendar" activeClassName="active-link-icon">
                <FontAwesomeIcon
                  icon={["far", "calendar-alt"]}
                  style={{ width: "40px", height: "40px" }}
                />
              </NavLink>
            </Navbar.Brand>

            {/* <Navbar.Brand>
              <NavLink to="/covid-app" activeClassName="active-link-icon">
                <FontAwesomeIcon
                  icon={["fas", "virus-slash"]}
                  style={{ width: "40px", height: "40px" }}
                />
              </NavLink>
            </Navbar.Brand> */}

            {/* <Navbar.Brand>
              <NavLink to="/todo-app-redux" activeClassName="active-link-icon">
                <FontAwesomeIcon
                  icon={["far", "list-alt"]}
                  style={{ width: "40px", height: "40px" }}
                />
              </NavLink>
            </Navbar.Brand> */}

            <Navbar.Toggle aria-controls="basic-navbar-nav">
              <FontAwesomeIcon
                icon={["fas", "bars"]}
                style={{ width: "40px", height: "40px" }}
              />
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-md-auto d-flex align-items-md-center my-2 my-md-0">
                <NavLink
                  to={`/${user?.email}`}
                  activeClassName="active-link-icon-text"
                  className="mx-2 py-1 mb-2 mb-md-0"
                >
                  <div className="d-flex align-items-center">
                    {user?.photoURL ? (
                      <Image
                        src={user.photoURL}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "pink",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#fff",
                          }}
                        >
                          {user?.displayName?.charAt(0)}
                        </div>
                      </div>
                    )}

                    <span className="ms-2 active-link-icon-text-displayName">
                      {user?.displayName}
                    </span>
                  </div>
                </NavLink>
                {/* 
                <NavLink
                  to="/todo-app"
                  activeClassName="active-link-icon-text"
                  className="mx-2 py-1"
                >
                  <span>Todo App</span>
                </NavLink> */}

                {/* <NavLink
                  to="/stories-app"
                  activeClassName="active-link-icon-text"
                  className="mx-2 py-1"
                >
                  <span> Hacker News Stories App</span>
                </NavLink> */}

                <SearchUserForm />

                <NavDropdown id="basic-nav-dropdown" className="mx-2">
                  <NavDropdown.Item onClick={handleSignOut}>
                    <span style={{ border: "none", color: "#000" }}>
                      Sign out
                    </span>
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
    </>
  );
}
