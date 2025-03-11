import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ConfirmationModal from "../../../components/ConfirmationModal";

describe("ConfirmationModal Component", () => {
  const handleOnClick = jest.fn();
  const handleOnClose = jest.fn();

  test("renders modal with title and text", () => {
    render(
      <ConfirmationModal
        showModal={true}
        handleOnClick={handleOnClick}
        handleOnClose={handleOnClose}
        title="Test Title"
        text="Test Text"
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Text")).toBeInTheDocument();
  });

  test("calls handleOnClick when confirm button is clicked", () => {
    render(
      <ConfirmationModal
        showModal={true}
        handleOnClick={handleOnClick}
        handleOnClose={handleOnClose}
        title="Test Title"
        text="Test Text"
      />
    );

    fireEvent.click(screen.getByText("app_common.confirm"));
    expect(handleOnClick).toHaveBeenCalled();
  });

  test("calls handleOnClose when cancel button is clicked", () => {
    render(
      <ConfirmationModal
        showModal={true}
        handleOnClick={handleOnClick}
        handleOnClose={handleOnClose}
        title="Test Title"
        text="Test Text"
      />
    );

    fireEvent.click(screen.getByText("app_common.cancel"));
    expect(handleOnClose).toHaveBeenCalled();
  });

  test("does not render modal when showModal is false", () => {
    render(
      <ConfirmationModal
        showModal={false}
        handleOnClick={handleOnClick}
        handleOnClose={handleOnClose}
        title="Test Title"
        text="Test Text"
      />
    );

    expect(screen.queryByText("Test Title")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Text")).not.toBeInTheDocument();
  });

  test("disables buttons when isLoading is true", () => {
    render(
      <ConfirmationModal
        showModal={true}
        handleOnClick={handleOnClick}
        handleOnClose={handleOnClose}
        title="Test Title"
        text="Test Text"
        isLoading={true}
      />
    );

    expect(screen.getByText("app_common.confirm")).toBeDisabled();
    expect(screen.getByText("app_common.cancel")).toBeDisabled();
  });
});
