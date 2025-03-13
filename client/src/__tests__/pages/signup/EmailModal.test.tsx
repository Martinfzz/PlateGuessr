import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EmailModal from "../../../pages/signup/EmailModal";
import { AuthContext } from "../../../context/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";

describe("EmailModal Component", () => {
  const mockSetShowEmailModal = jest.fn();

  const setup = () => {
    render(
      <AuthContext.Provider value={{ user: null, dispatch: jest.fn() }}>
        <Router>
          <EmailModal
            showEmailModal={true}
            setShowEmailModal={mockSetShowEmailModal}
          />
        </Router>
      </AuthContext.Provider>
    );
  };

  beforeEach(() => {
    setup();
  });

  test("renders EmailModal component when showEmailModal is true", () => {
    expect(screen.getByText("pages.signup.modal_title_1")).toBeInTheDocument();
    expect(screen.getByText("pages.signup.modal_title_2")).toBeInTheDocument();
  });

  test("calls setShowEmailModal when close button is clicked", () => {
    fireEvent.click(screen.getByTestId("close-button"));
    expect(mockSetShowEmailModal).toHaveBeenCalled();
  });

  test("renders EmailForm component", () => {
    expect(screen.getByTestId("signup-form")).toBeInTheDocument();
  });
});
