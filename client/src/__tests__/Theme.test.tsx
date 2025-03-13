import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ThemeProvider, ThemeContext } from "../Theme";

jest.mock("primereact/api", () => ({
  PrimeReactContext: React.createContext({
    changeTheme: jest.fn(),
  }),
}));

describe("ThemeProvider", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should set the theme from localStorage and apply it", () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({ theme }) => <div data-testid="theme">{theme}</div>}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light-theme");
  });

  test("should toggle the theme from light to dark", () => {
    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => (
            <>
              <div>{value.theme}</div>
              <button onClick={value.toggleTheme}>Toggle Theme</button>
            </>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByText("light-theme")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Toggle Theme/i });
    fireEvent.click(button);

    expect(localStorage.getItem("theme")).toBe("dark-theme");
  });

  test("should toggle the theme from dark to light", () => {
    localStorage.setItem("theme", "dark-theme");

    render(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => (
            <>
              <div>{value.theme}</div>
              <button onClick={value.toggleTheme}>Toggle Theme</button>
            </>
          )}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );

    expect(screen.getByText("dark-theme")).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /Toggle Theme/i });
    fireEvent.click(button);

    expect(localStorage.getItem("theme")).toBe("light-theme");
  });
});
