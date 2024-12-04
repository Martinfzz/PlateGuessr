import React, { useEffect, createContext, useState, useContext } from "react";
import { PrimeReactContext } from "primereact/api";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const { changeTheme } = useContext(PrimeReactContext);

  const getTheme = () => {
    const theme = localStorage.getItem("theme");

    if (theme === "light-theme") {
      // Default theme is taken as ligth-theme
      localStorage.setItem("theme", "light-theme");
      changeTheme("lara-dark-cyan", "lara-light-cyan", "prime-react-theme");
      return "light-theme";
    } else {
      changeTheme("lara-light-cyan", "lara-dark-cyan", "prime-react-theme");
      return theme;
    }
  };

  const [theme, setTheme] = useState(getTheme);

  function toggleTheme() {
    if (theme === "dark-theme") {
      changeTheme(
        "lara-dark-cyan",
        "lara-light-cyan",
        "prime-react-theme",
        () => setTheme("light-theme")
      );
    } else {
      changeTheme(
        "lara-light-cyan",
        "lara-dark-cyan",
        "prime-react-theme",
        () => setTheme("dark-theme")
      );
    }
  }

  useEffect(() => {
    const refreshTheme = () => {
      localStorage.setItem("theme", theme);
    };

    refreshTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
