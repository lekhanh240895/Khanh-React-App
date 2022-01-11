import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { useAppContext } from "../../contexts/AppContext";
import { Link } from "react-router-dom";

export const ChatIcon = () => {
  const { setShowChatSidebar } = useAppContext();

  return (
    <Link to={`/messages`}>
      <span onClick={() => setShowChatSidebar(true)}>
        <FontAwesomeIcon
          icon={faFacebookMessenger}
          id="chat-icon"
          className="bg-primary text-white"
        />
      </span>
    </Link>
  );
};

export default ChatIcon;
