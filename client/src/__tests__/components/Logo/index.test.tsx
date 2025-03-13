import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Logo from "../../../components/Logo";

describe("Logo Component", () => {
  const setup = (className: string = "") => {
    return render(
      <Router>
        <Logo className={className} />
      </Router>
    );
  };

  test("renders logo with correct className", () => {
    setup("test-class");

    expect(screen.getByTestId("logo-id")).toHaveClass("test-class");
  });

  test("renders full logo image with correct src and alt attributes", () => {
    setup();

    const fullLogo = screen.getByAltText("app logo");
    expect(fullLogo).toBeInTheDocument();
    expect(fullLogo).toHaveAttribute("src", "/plateguessr_logo.png");
    expect(fullLogo).toHaveClass("logo logo-full");
  });

  test("renders icon logo image with correct src and alt attributes", () => {
    setup();

    const iconLogo = screen.getByAltText("app icon");
    expect(iconLogo).toBeInTheDocument();
    expect(iconLogo).toHaveAttribute("src", "/plateguessr_icon.png");
    expect(iconLogo).toHaveClass("logo logo-icon");
  });

  test("renders links with correct href attributes", () => {
    setup();

    const links = screen.getAllByRole("link");
    expect(links.length).toBe(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute("href", "/");
    });
  });
});
