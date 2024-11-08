import React from "react";
import MainLayout from "./components/Maps/MainLayout";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <MainLayout />
      <Outlet />
    </>
  );
}

export default App;
