import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmailForm from "../../../pages/signup/EmailForm";
import { useSignup } from "../../../hooks/useSignup";

jest.mock("../../../hooks/useSignup", () => ({
  useSignup: jest.fn(),
}));

describe("EmailForm Component", () => {
  const mockSignup = jest.fn();
  const handleSubmit = jest.fn();
  let skipBeforeEach = false;

  const setup = () => {
    render(<EmailForm />);
  };

  beforeEach(() => {
    (useSignup as jest.Mock).mockReturnValue({
      signup: mockSignup,
      error: null,
      isLoading: false,
    });
    if (!skipBeforeEach) setup();
  });

  test("renders EmailForm component", () => {
    expect(screen.getByLabelText("app_common.email")).toBeInTheDocument();
    expect(screen.getByLabelText("app_common.password")).toBeInTheDocument();
    expect(
      screen.getByLabelText("pages.signup.password_confirmation")
    ).toBeInTheDocument();
    expect(screen.getByText("app_common.signup")).toBeInTheDocument();
  });

  test("should not call handleSubmit on submit with invalid values", async () => {
    fireEvent.click(screen.getByText("app_common.signup"));

    await waitFor(() => {
      expect(screen.getAllByText("validations.required")).toHaveLength(3);
    });

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("should throw error when password and password confirmation do not match", async () => {
    fireEvent.change(screen.getByLabelText("app_common.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("app_common.password"), {
      target: { value: "Password123*" },
    });
    fireEvent.change(
      screen.getByLabelText("pages.signup.password_confirmation"),
      {
        target: { value: "Password1234*" },
      }
    );

    fireEvent.click(screen.getByText("app_common.signup"));

    await waitFor(() => {
      expect(
        screen.getByText("validations.password_match")
      ).toBeInTheDocument();
    });
  });

  test("should throw error when password is not strong", async () => {
    fireEvent.change(screen.getByLabelText("app_common.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("app_common.password"), {
      target: { value: "password" },
    });
    fireEvent.change(
      screen.getByLabelText("pages.signup.password_confirmation"),
      {
        target: { value: "password" },
      }
    );

    fireEvent.click(screen.getByText("app_common.signup"));

    await waitFor(() => {
      expect(
        screen.getByText("validations.password_validation")
      ).toBeInTheDocument();
    });
  });

  test("should have the right initial values", () => {
    expect(screen.getByLabelText("app_common.email")).toHaveValue("");
    expect(screen.getByLabelText("app_common.password")).toHaveValue("");
    expect(
      screen.getByLabelText("pages.signup.password_confirmation")
    ).toHaveValue("");
  });

  test("should call singup function when form is submitted", async () => {
    fireEvent.change(screen.getByLabelText("app_common.email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("app_common.password"), {
      target: { value: "Password123*" },
    });
    fireEvent.change(
      screen.getByLabelText("pages.signup.password_confirmation"),
      {
        target: { value: "Password123*" },
      }
    );

    fireEvent.click(screen.getByText("app_common.signup"));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        "test@example.com",
        "Password123*",
        "Password123*"
      );
    });
  });

  test("should display Alert component when error is present", () => {
    skipBeforeEach = true;
    (useSignup as jest.Mock).mockReturnValue({
      signup: mockSignup,
      isLoading: false,
      error: "Error",
    });

    setup();

    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
