import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ResetPassword from "../../../pages/resetPassword";

describe("ResetPassword Component", () => {
  const setup = () => {
    render(
      <Router>
        <ResetPassword />
      </Router>
    );
  };

  beforeEach(() => {
    setup();
  });

  test("renders ResetPassword component", () => {
    expect(screen.getByLabelText("app_common.email")).toBeInTheDocument();
    expect(screen.getAllByText("pages.reset_password.heading")).toHaveLength(2);
    expect(screen.getByTestId("connexion-btn")).toBeInTheDocument();
  });

  test("validates form fields and shows error messages", async () => {
    fireEvent.click(screen.getAllByText("pages.reset_password.heading")[1]);

    expect(await screen.findByText("validations.required")).toBeInTheDocument();
  });

  test("submits form with valid email", async () => {
    fireEvent.change(screen.getByLabelText("app_common.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getAllByText("pages.reset_password.heading")[1]);

    await waitFor(() => {
      expect(screen.getByLabelText("app_common.email")).toHaveValue(
        "test@example.com"
      );
    });
  });
});
