import React from "react";
import { render, screen } from "@testing-library/react";
import CustomSpinner from "../../../shared/components/CustomSpinner";

describe("CustomSpinner", () => {
  it("should render the spinner component correctly", () => {
    render(<CustomSpinner />);
    const spinnerComponent = screen.getByTestId("custom-spinner");
    expect(spinnerComponent).toBeInTheDocument();
  });

  it("should render the spinner component with center class when center prop is true", () => {
    render(<CustomSpinner center />);
    const spinnerComponent = screen.getByTestId("custom-spinner");
    expect(spinnerComponent).toHaveClass("text-center");
  });
});
