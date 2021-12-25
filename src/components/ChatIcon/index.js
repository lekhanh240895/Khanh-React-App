import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

export const ChatIcon = () => {
  return (
    <Link to="/messages">
      <FontAwesomeIcon
        icon={faFacebookMessenger}
        id="chat-icon"
        className="bg-primary text-white"
      />
    </Link>
  );
};

export default ChatIcon;
