import React, { useContext } from "react";
import { ThemeContext } from "../../Theme";
import { MDBBtn } from "mdb-react-ui-kit";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      data-testid="theme-toggle-button"
      className="d-flex align-items-center me-3 theme-toggle"
    >
      <MDBBtn onClick={() => toggleTheme()} className={theme}>
        {theme === "dark-theme" ? (
          <FontAwesomeIcon icon={faMoon} data-testid="theme-icon" />
        ) : (
          <FontAwesomeIcon icon={faSun} data-testid="theme-icon" />
        )}
      </MDBBtn>
    </div>
  );
};

export default ThemeToggleButton;
