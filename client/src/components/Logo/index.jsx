import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ className }) => {
  return (
    <div className={className}>
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
  );
};

export default Logo;
