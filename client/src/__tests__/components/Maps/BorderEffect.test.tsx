import React from "react";
import { render, screen } from "@testing-library/react";
import BorderEffect from "../../../components/Maps/BorderEffect";

describe("BorderEffect Component", () => {
  test("renders with correct classes when goodGuess is true", () => {
    render(<BorderEffect goodGuess={true} />);

    expect(screen.getByTestId("top-bar")).toHaveClass(
      "border-effect-top-bar border-effect-color-true"
    );
    expect(screen.getByTestId("bottom-bar")).toHaveClass(
      "border-effect-bottom-bar border-effect-color-true"
    );
    expect(screen.getByTestId("right-bar")).toHaveClass(
      "border-effect-right-bar border-effect-color-true"
    );
    expect(screen.getByTestId("left-bar")).toHaveClass(
      "border-effect-left-bar border-effect-color-true"
    );
  });

  test("renders with correct classes when goodGuess is false", () => {
    render(<BorderEffect goodGuess={false} />);

    expect(screen.getByTestId("top-bar")).toHaveClass(
      "border-effect-top-bar border-effect-color-false"
    );
    expect(screen.getByTestId("bottom-bar")).toHaveClass(
      "border-effect-bottom-bar border-effect-color-false"
    );
    expect(screen.getByTestId("right-bar")).toHaveClass(
      "border-effect-right-bar border-effect-color-false"
    );
    expect(screen.getByTestId("left-bar")).toHaveClass(
      "border-effect-left-bar border-effect-color-false"
    );
  });
});
