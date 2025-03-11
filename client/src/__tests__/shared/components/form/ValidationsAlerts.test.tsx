import React from "react";
import { render, screen } from "@testing-library/react";
import ValidationsAlerts from "../../../../shared/components/form/ValidationsAlerts";

describe("ValidationsAlerts Component", () => {
  test("renders ValidationsAlerts component with messages", () => {
    const message = "Error 1";
    render(<ValidationsAlerts>{message}</ValidationsAlerts>);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test("renders ValidationsAlerts component without messages", () => {
    render(<ValidationsAlerts>{[]}</ValidationsAlerts>);
    expect(screen.queryByText(/./)).toBeNull();
  });
});
