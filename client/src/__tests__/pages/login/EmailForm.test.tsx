import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import EmailForm from "../../../pages/login/EmailForm";

describe("EmailForm Component", () => {
  const handleSubmit = jest.fn();

  const setup = (loading: boolean = false) => {
    render(
      <Router>
        <EmailForm isLoading={loading} handleSubmit={handleSubmit} />
      </Router>
    );
  };

  test("renders EmailForm component", () => {
    setup();

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  test("should have the right initial values", () => {
    setup();

    expect(screen.getByLabelText("app_common.email")).toHaveValue("");
    expect(screen.getByLabelText("app_common.password")).toHaveValue("");
  });

  test("should have the right inputs", () => {
    setup();

    expect(screen.getByLabelText("app_common.email")).toBeInTheDocument();
    expect(screen.getByLabelText("app_common.password")).toBeInTheDocument();
  });

  test("should call handleSubmit on submit with valid values", async () => {
    setup();

    fireEvent.change(screen.getByLabelText("app_common.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("app_common.password"), {
      target: { value: "password" },
    });

    fireEvent.submit(screen.getByText("app_common.login"));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });
  });

  test("should not call handleSubmit on submit with invalid values", async () => {
    setup();

    fireEvent.click(screen.getByText("app_common.login"));

    await waitFor(() => {
      expect(screen.getAllByText("validations.required")).toHaveLength(2);
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("should display forgot password link", () => {
    setup();

    const link = screen.getByText("pages.login.forgot_password");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/reset-password");
  });

  test("should disable button when loading", () => {
    setup(true);

    expect(screen.getByText("app_common.login")).toBeDisabled();
  });
});
