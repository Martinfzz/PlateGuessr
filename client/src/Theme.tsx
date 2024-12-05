import React, {
  useEffect,
  createContext,
  useState,
  useContext,
  ReactNode,
  FC,
} from "react";
import { PrimeReactContext } from "primereact/api";

interface ThemeContextType {
  theme: string;
  setTheme?: React.Dispatch<React.SetStateAction<string>>;
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
    const theme = localStorage.getItem("theme");

    if (theme === "light-theme") {
      // Default theme is taken as ligth-theme
      localStorage.setItem("theme", "light-theme");
      changeTheme &&
        changeTheme("lara-dark-cyan", "lara-light-cyan", "prime-react-theme");
      return "light-theme";
    } else {
      changeTheme &&
        changeTheme("lara-light-cyan", "lara-dark-cyan", "prime-react-theme");
      return theme || "";
    }
  };

  const [theme, setTheme] = useState<string>(getTheme);

  function toggleTheme() {
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
