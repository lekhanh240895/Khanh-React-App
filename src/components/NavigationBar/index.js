import React from "react";
import { Navbar, Container, Nav, NavDropdown, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useAppContext } from "../../contexts/AppContext";
import { auth } from "../../firebase/config";
import "./index.css";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

export default function NavigationBar() {
  const { user, logout } = useAuth();
  const { setShowChatSidebar } = useAppContext();

  const handleSignOut = async () => {
    try {
      await logout(auth);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {user && (
        <Navbar expand="md" bg="dark" variant="dark" className="mb-4">
          <Container fluid>
            <Navbar.Brand>
              <NavLink exact to={"/"} activeClassName="text-white">
                <FontAwesomeIcon
                  icon={["fab", "korvue"]}
                  style={{ width: "40px", height: "40px" }}
                />
              </NavLink>
            </Navbar.Brand>

            <Navbar.Brand>
              <NavLink
                to="/messages"
                activeClassName="text-white"
                onClick={() => setShowChatSidebar(true)}
              >
                <FontAwesomeIcon
                  icon={faFacebookMessenger}
                  style={{ width: "40px", height: "40px" }}
                />
              </NavLink>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav">
              <FontAwesomeIcon icon={["fas", "bars"]} />
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mx-auto d-flex align-items-md-center">
                <NavLink
                  to={`/${user?.email}`}
                  activeClassName="text-white"
                  className="mx-2 py-1"
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
                        className="text-white d-flex justify-content-center align-items-center"
                      >
                        <span style={{ fontSize: "20px", fontWeight: "600" }}>
                          {user?.displayName?.charAt(0)}
                        </span>
                      </div>
                    )}

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

                <NavDropdown id="basic-nav-dropdown" className="ms-2">
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
      )}
    </>
  );
}
