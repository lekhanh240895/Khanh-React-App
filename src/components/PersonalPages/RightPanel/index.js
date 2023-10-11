import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useAppContext } from "../../../contexts/AppContext";
import "./index.css";
import { db } from "../../../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { orderBy, some } from "lodash";

export default function RightPanel() {
  const { users, rooms, userDoc, setSelectedRoomId, setShowChatWindow } =
    useAppContext();
  const [query, setQuery] = useState("");
  const filterUsers = users.filter((user) => user.uid !== userDoc?.uid);
  const [chatUsers, setChatUsers] = useState(filterUsers);

  const searchUsers = filterUsers.filter((user) => {
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

  const searchRooms = rooms.filter((room) => {
    const newStr1 = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
    const newStr2 = room.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    return newStr2.includes(newStr1);
  });

  const orderRooms = orderBy(searchRooms, ["createdAt", "type"], ["desc"]);

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

  const handleSelectRoom = (room) => {
    setSelectedRoomId(room.id);
  };

  const handleSelectChatUser = async (user) => {
    if (some(rooms, { members: [userDoc?.uid, user.uid], type: "invidual" })) {
      return null;
    }

    const docRef = await addDoc(collection(db, "rooms"), {
      name: `${userDoc?.displayName}, ${user.displayName}`,
      members: [userDoc?.uid, user.uid],
      type: "invidual",
      createdAt: serverTimestamp(),
    });

    const newChatUsers = chatUsers.filter((u) => u.uid !== user.uid);
    setChatUsers(newChatUsers);
    setSelectedRoomId(docRef.id);
    setShowChatWindow(true);
  };

  return (
    <div
      className="right-panel-wrapper"
      ref={divRef}
      style={{
        maxHeight: "calc(100vh - 100px)",
        height: "fit-content",
        overflowY: "auto",
        width: "20vw",
        position: "sticky",
        top: "70px",
        borderRadius: 5,
      }}
    >
      {showSearchBar ? (
        <div className="bg-white searchContact mb-3">
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
          <div key={user.uid}>
            {!some(rooms, {
              members: [userDoc?.uid, user.uid],
              type: "invidual",
            }) && (
              <div
                className=" d-flex align-items-center mb-3"
                style={{
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleSelectChatUser(user)}
              >
                <Avatar
                  src={user.photoURL}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "pink",
                    fontSize: "25px",
                  }}
                  className="d-flex justify-content-center align-items-center me-2"
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

                <div style={{ fontSize: 18 }}>{user.displayName}</div>
              </div>
            )}
          </div>
        ))}

        {offlineUsers.map((user) => (
          <div key={user.uid}>
            {!some(rooms, {
              members: [userDoc?.uid, user.uid],
              type: "invidual",
            }) && (
              <div
                className="d-flex align-items-center mb-3"
                style={{
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => handleSelectChatUser(user)}
              >
                <Avatar
                  src={user.photoURL}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "pink",
                    fontSize: "25px",
                  }}
                  className="d-flex justify-content-center align-items-center me-2"
                >
                  {user.displayName?.charAt(0)}
                </Avatar>

                <div style={{ fontSize: 18 }}>{user.displayName}</div>
              </div>
            )}
          </div>
        ))}

        {orderRooms?.map((room) => {
          const chatUserUid = room.members.find((uid) => uid !== userDoc?.uid);
          const chatUser = users.find((user) => user.uid === chatUserUid);
          return room.members?.length === 2 ? (
            <div className="d-flex align-items-center mb-3" key={room.id}>
              <div style={{ position: "relative" }}>
                <Avatar
                  src={chatUser.photoURL}
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "pink",
                    fontSize: "25px",
                  }}
                  className="d-flex justify-content-center align-items-center me-2"
                >
                  {chatUser.displayName?.charAt(0).toUpperCase()}
                </Avatar>

                {chatUser.isOnline && (
                  <span
                    style={{
                      position: "absolute",
                      top: 35,
                      left: 35,
                      zIndex: 99,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "circle"]}
                      style={{
                        width: 15,
                        height: 15,
                        color: "#00c900",
                      }}
                    />
                  </span>
                )}
              </div>

              <div
                onClick={() => handleSelectRoom(room)}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {chatUser.displayName}
              </div>
            </div>
          ) : (
            <div
              key={room.id}
              className="d-flex align-items-center mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleSelectRoom(room)}
            >
              <Avatar.Group
                maxCount="1"
                maxStyle={{ fontSize: "18px" }}
                className="me-2"
                size={50}
              >
                {room.members?.map((uid) => {
                  const member = users.find((user) => user.uid === uid);
                  return (
                    <div style={{ position: "relative" }} key={member.uid}>
                      <Avatar
                        src={member.photoURL}
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: "pink",
                          fontSize: "25px",
                        }}
                        className="d-flex justify-content-center align-items-center"
                      >
                        {member.displayName?.charAt(0).toUpperCase()}
                      </Avatar>

                      {member.isOnline && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "-5px",
                            right: "-3px",
                            zIndex: 99,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={["fas", "circle"]}
                            style={{
                              width: 15,
                              height: 15,
                              color: "#00c900",
                            }}
                          />
                        </span>
                      )}
                    </div>
                  );
                })}
              </Avatar.Group>

              <div
                style={{
                  fontSize: "18px",
                }}
              >
                {room.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
