import React, { useContext } from "react";
import { ThemeContext } from "../../Theme";
import { MDBBtn } from "mdb-react-ui-kit";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="d-flex align-items-center me-3 theme-toggle">
      <MDBBtn onClick={() => toggleTheme()} className={theme}>
        {theme === "dark-theme" ? (
          <FontAwesomeIcon icon={faMoon} />
        ) : (
          <FontAwesomeIcon icon={faSun} />
        )}
      </MDBBtn>
    </div>
  );
};

export default ThemeToggleButton;
