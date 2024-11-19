import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <div className="logo-container">
        <Link to={"/"} className="d-flex">
          <img
            alt="app logo"
            src="/plateguessr_logo.png"
            className="logo logo-full"
          />
        </Link>
        <Link to={"/"}>
          <img
            alt="app icon"
            src="/plateguessr_icon.png"
            className="logo logo-icon"
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
