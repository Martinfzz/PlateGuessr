import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";
import { ThemeContext } from "../Theme";

jest.mock("../components/Maps/MainLayout", () => (
  <div>MainLayout Component</div>
));

describe("App Component", () => {
  test("renders App component with MainLayout and Outlet", () => {
    render(
      <ThemeContext.Provider value={{ theme: "light", toggleTheme: jest.fn() }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByText("MainLayout Component")).toBeInTheDocument();
  });

  test("applies theme class to App component", () => {
    render(
      <ThemeContext.Provider
        value={{ theme: "dark-theme", toggleTheme: jest.fn() }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeContext.Provider>
    );

    expect(screen.getByTestId("app-container")).toHaveClass("App dark-theme");
  });
});
