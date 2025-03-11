import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ThemeToggleButton from "../../../components/ThemeToggleButton";
import { ThemeContext } from "../../../Theme";

describe("ThemeToggleButton Component", () => {
  const toggleTheme = jest.fn();

  test("renders ThemeToggleButton component with dark theme", () => {
    render(
      <ThemeContext.Provider value={{ theme: "dark-theme", toggleTheme }}>
        <ThemeToggleButton />
      </ThemeContext.Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("dark-theme");
    const svg = screen.getByTestId("theme-icon");
    expect(svg).toHaveClass("fa-moon");
  });

  test("renders ThemeToggleButton component with light theme", () => {
    render(
      <ThemeContext.Provider value={{ theme: "light-theme", toggleTheme }}>
        <ThemeToggleButton />
      </ThemeContext.Provider>
    );

    const button = screen.getByRole("button");
    expect(button).toHaveClass("light-theme");
    const svg = screen.getByTestId("theme-icon");
    expect(svg).toHaveClass("fa-sun");
  });

  test("calls toggleTheme when button is clicked", () => {
    render(
      <ThemeContext.Provider value={{ theme: "light-theme", toggleTheme }}>
        <ThemeToggleButton />
      </ThemeContext.Provider>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(toggleTheme).toHaveBeenCalled();
  });
});
