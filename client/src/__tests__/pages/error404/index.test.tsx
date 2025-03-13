import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Error404 from "../../../pages/error404";

describe("Error404", () => {
  test("renders component with error message and logo", () => {
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>
    );

    const errorMessage = screen.getByText("pages.error404.text");

    expect(errorMessage).toBeInTheDocument();
  });
});
