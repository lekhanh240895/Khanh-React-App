import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "../../contexts/AppContext";
import UserAvatar from "../PersonalPages/UserAvatar";
import "./index.css";
import { some } from "lodash";
import { Link } from "react-router-dom";
import { Avatar } from "antd";

export default function SearchUserForm() {
  const { users } = useAppContext();
  const [showSearchBar, setShowSearchBar] = useState(false);

  const { searchDetails } =
    JSON.parse(localStorage.getItem("searchDetails")) || {};

  const [query, setQuery] = useState("");
  const [searches, setSearches] = useState(searchDetails || []);

  const getLastSearches = (searches) =>
    searches
      .reduce((result, search, index) => {
        if (index === 0) {
          return result.concat(search);
        }

        const previousSearch = result[result.length - 1];
        if (previousSearch === search) {
          return result;
        }
        if (some(result, search)) {
          const newResult = result.filter((s) => s !== search);
          return newResult.concat(search);
        } else {
          return result.concat(search);
        }
      }, [])
      .slice(-5);

  const lastSearches = getLastSearches(searches);

  const inputRef = React.useRef(null);

  const handleSearchInputChange = (e) => {
    setShowSearchBar(true);
    setQuery(e.target.value);
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

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

  const handleSearch = (user) => {
    setSearches(searches.concat(user));

    localStorage.setItem(
      "searchDetails",
      JSON.stringify({
        searchQuery: query,
        searchDetails: some(lastSearches, user)
          ? lastSearches
          : lastSearches.concat(user),
      })
    );
  };

  const handleRemoveLastSearch = (user) => {
    const newSearches = searches.filter((search) => search.uid !== user.uid);
    setSearches(newSearches);

    localStorage.setItem(
      "searchDetails",
      JSON.stringify({
        searchQuery: query,
        searchDetails: newSearches,
      })
    );
  };

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
    <Form className="d-flex align-items-center mx-2 pt-2 p-lg-1">
      <div
        className="d-flex justify-content-between"
        style={{ position: "relative" }}
        ref={divRef}
      >
        <span
          className="me-2 icon-background"
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

        <Form.Control
          type="search"
          placeholder="Search"
          aria-label="Search"
          style={{
            borderRadius: "20px",
            height: "40px",
          }}
          className="mb-3 d-lg-none"
          onChange={handleSearchInputChange}
          value={query}
        />

        {showSearchBar && (
          <div className="me-2 bg-white p-3 searchBar">
            <div className="d-flex justify-content-between">
              <span
                onClick={() => setShowSearchBar(!showSearchBar)}
                className="me-2 icon-background"
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
                className="mb-3"
                onChange={handleChange}
                value={query}
                ref={inputRef}
              />
            </div>

            {!query ? (
              <div>
                <div
                  className="d-flex justify-content-between "
                  style={{ fontSize: "16px" }}
                >
                  <span>Last searches</span>
                  <span>Edit</span>
                </div>

                <div className="d-flex flex-column-reverse">
                  {lastSearches.map((user) => (
                    <div
                      className="d-flex justify-content-between my-2"
                      key={user.uid}
                    >
                      <Link
                        to={`/${user.email}`}
                        onClick={() => setShowSearchBar(false)}
                      >
                        <div
                          className="d-flex align-items-center justify-content-between"
                          onClick={() => handleSearch(user)}
                          style={{ cursor: "pointer" }}
                        >
                          <Avatar
                            src={user.photoURL}
                            style={{
                              width: "50px",
                              height: "50px",
                              backgroundColor: "pink",
                              color: "#fff",
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
                      </Link>

                      <span
                        style={{
                          backgroundColor: "#F0F2F5",
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          padding: "20px",
                          cursor: "pointer",
                        }}
                        className="d-flex justify-content-center align-items-center"
                        onClick={() => handleRemoveLastSearch(user)}
                      >
                        <FontAwesomeIcon
                          icon={["fas", "times"]}
                          style={{
                            width: 15,
                            height: 15,
                            color: "rgba(0, 0, 0, 0.4)",
                          }}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              searchUsers.map((user) => (
                <div
                  className="d-flex align-items-center mb-3"
                  onClick={() => handleSearch(user)}
                  key={user.uid}
                >
                  <UserAvatar
                    float="left"
                    email={user.email}
                    photoURL={user.photoURL}
                    width="50px"
                    height="50px"
                    textSize="25px"
                  >
                    {user.displayName?.charAt(0)}
                  </UserAvatar>

                  <Link to={`/${user.email}`}>
                    <h5 style={{ padding: "0 10px", fontSize: 18 }}>
                      {user.displayName}
                    </h5>
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Form>
  );
}
