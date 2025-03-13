import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  FC,
} from "react";
import { PrimeReactContext } from "primereact/api";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "",
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const { changeTheme } = useContext(PrimeReactContext);

  const getTheme = (): string => {
    const theme = localStorage.getItem("theme") ?? "light-theme";

    if (theme === "light-theme") {
      // Default theme is taken as ligth-theme
      localStorage.setItem("theme", "light-theme");
      changeTheme &&
        changeTheme("lara-dark-cyan", "lara-light-cyan", "prime-react-theme");
      return "light-theme";
    } else {
      changeTheme &&
        changeTheme("lara-light-cyan", "lara-dark-cyan", "prime-react-theme");
      return "dark-theme";
    }
  };

  const [theme, setTheme] = useState<string>(getTheme);

  const toggleTheme = () => {
    if (theme === "dark-theme") {
      changeTheme &&
        changeTheme(
          "lara-dark-cyan",
          "lara-light-cyan",
          "prime-react-theme",
          () => setTheme("light-theme")
        );
    } else {
      changeTheme &&
        changeTheme(
          "lara-light-cyan",
          "lara-dark-cyan",
          "prime-react-theme",
          () => setTheme("dark-theme")
        );
    }
    localStorage.setItem(
      "theme",
      theme === "dark-theme" ? "light-theme" : "dark-theme"
    );
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
