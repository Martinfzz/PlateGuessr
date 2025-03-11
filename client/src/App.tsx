import React, { useContext } from "react";
import MainLayout from "./components/Maps/MainLayout";
import { Outlet } from "react-router-dom";
import { ThemeContext } from "./Theme";

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`App ${theme}`} data-testid="app-container">
      <MainLayout />
      <Outlet />
    </div>
  );
}

export default App;
