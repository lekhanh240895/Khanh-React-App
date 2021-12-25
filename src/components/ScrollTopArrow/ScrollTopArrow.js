import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ScrollTopArrow.css";

export const ScrollTopArrow = ({ showBelow = 200 }) => {
  const [showScroll, setShowScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", checkscrollTop);
    return () => {
      window.removeEventListener("scroll", checkscrollTop);
    };
  });

  const checkscrollTop = () => {
    if (!showScroll && window.scrollY >= showBelow) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY < showBelow) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <FontAwesomeIcon
      icon={["fas", "arrow-up"]}
      id="scrollArrow"
      className="bg-primary text-white"
      onClick={scrollTop}
      style={{ display: showScroll ? "inline-block" : "none" }}
    />
  );
};

export default ScrollTopArrow;
