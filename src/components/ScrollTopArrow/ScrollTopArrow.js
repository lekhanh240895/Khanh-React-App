import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";

export const ScrollTopArrow = ({ showBelow = 200 }) => {
  const [showScroll, setShowScroll] = useState(false);
  const [isScrollUp, setIsScrollUp] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", checkscrollTop);

    var lastScrollTop = 0;
    window.addEventListener(
      "scroll",
      function () {
        // or window.addEventListener("scroll"....
        var st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        if (st > lastScrollTop) {
          // downscroll code
          setIsScrollUp(false);
        } else {
          // upscroll code
          setIsScrollUp(true);
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
      },
      false
    );

    return () => {
      window.removeEventListener("scroll", checkscrollTop);
    };
  });

  const checkscrollTop = () => {
    if (!showScroll && window.scrollY >= showBelow && isScrollUp) {
      setShowScroll(true);
    } else if ((showScroll && window.scrollY < showBelow) || !isScrollUp) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <FontAwesomeIcon
      icon={["fas", "arrow-circle-up"]}
      id="scrollArrow"
      className="bg-primary text-white"
      onClick={scrollTop}
      style={{ display: showScroll ? "inline-block" : "none" }}
    />
  );
};

export default ScrollTopArrow;
