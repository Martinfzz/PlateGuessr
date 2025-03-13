import React from "react";
import { render, screen } from "@testing-library/react";
import Alerts from "../../../components/Alerts";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

describe("Alerts Component", () => {
  test("renders with default color", () => {
    render(<Alerts icon={faCheckCircle}>Test Alert</Alerts>);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("alert-primary");
    expect(screen.getByText("Test Alert")).toBeInTheDocument();
  });

  test("renders with specified color", () => {
    render(
      <Alerts icon={faCheckCircle} color="danger">
        Test Alert
      </Alerts>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("alert-danger");
  });

  test("renders with specified icon", () => {
    render(<Alerts icon={faCheckCircle}>Test Alert</Alerts>);

    const icon = screen.getByTestId("alert-icon");
    expect(icon).toBeInTheDocument();
  });

  test("renders children correctly", () => {
    render(<Alerts icon={faCheckCircle}>Test Alert</Alerts>);

    expect(screen.getByText("Test Alert")).toBeInTheDocument();
  });
});
