import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";
import "./index.css";

export default function RightPanel() {
  const { users } = useAppContext();
  const [query, setQuery] = useState("");

  const searchUsers = users.filter((user) => {
    const newStr1 = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    const newStr2 = user.displayName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return newStr2.includes(newStr1);
  });

  const onlineUsers = searchUsers.filter((user) => user.isOnline);
  const offlineUsers = searchUsers.filter((user) => !user.isOnline);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const inputRef = React.useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowSearchBar(false);
          setQuery("");
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  const divRef = React.useRef();
  useOutsideAlerter(divRef);

  return (
    <div className="right-panel-wrapper" ref={divRef}>
      {showSearchBar ? (
        <div className=" bg-white searchContact mb-3">
          <div className="d-flex justify-content-between">
            <span
              onClick={() => setShowSearchBar(!showSearchBar)}
              className="icon-background me-2"
            >
              <FontAwesomeIcon
                icon={["fas", "arrow-left"]}
                style={{
                  width: "20px",
                  height: "20px",
                  color: "rgba(0, 0, 0, 0.4)",
                }}
              />
            </span>

            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              style={{ borderRadius: "20px", height: "40px" }}
              onChange={handleChange}
              value={query}
              ref={inputRef}
            />
          </div>
        </div>
      ) : (
        <div className="right-panel-wrapper_header mb-3">
          <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>
            Contact users
          </span>
          <span
            className="icon-background"
            onClick={() => setShowSearchBar(!showSearchBar)}
          >
            <FontAwesomeIcon
              icon={["fas", "search"]}
              style={{
                color: "rgba(0, 0, 0, 0.4)",
                fontSize: "16px",
              }}
            />
          </span>
        </div>
      )}

      <div className="right-panel-wrapper_body">
        {onlineUsers.map((user) => (
          <div
            className=" d-flex align-items-center mb-3"
            style={{ position: "relative" }}
            key={user.uid}
          >
            <Avatar
              src={user.photoURL}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "pink",
                fontSize: "25px",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              {user.displayName?.charAt(0)}
            </Avatar>

            <span
              style={{
                position: "absolute",
                top: 35,
                left: 37,
              }}
            >
              <FontAwesomeIcon
                icon={["fas", "circle"]}
                style={{ width: 15, height: 15, color: "#00c900" }}
              />
            </span>

            <h5 style={{ padding: "0 10px", fontSize: 18 }}>
              {user.displayName}
            </h5>
          </div>
        ))}

        {offlineUsers.map((user) => (
          <div
            className="d-flex align-items-center mb-3"
            style={{ position: "relative" }}
            key={user.uid}
          >
            <Avatar
              src={user.photoURL}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "pink",
                fontSize: "25px",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              {user.displayName?.charAt(0)}
            </Avatar>

            <h5 style={{ padding: "0 10px", fontSize: 18 }}>
              {user.displayName}
            </h5>
          </div>
        ))}
      </div>
    </div>
  );
}
