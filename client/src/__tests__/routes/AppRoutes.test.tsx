import React from "react";
import { render, screen } from "@testing-library/react";
import AppRoutes from "../../routes/AppRoutes";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../App", () => () => <div>App Component</div>);
jest.mock("../../pages/error404", () => () => <div>Error 404 Component</div>);
jest.mock("../../pages/login", () => () => <div>LogIn Component</div>);
jest.mock("../../pages/signup", () => () => <div>SignUp Component</div>);
jest.mock("../../pages/resetPassword", () => () => (
  <div>ResetPassword Component</div>
));
jest.mock("../../pages/account", () => () => <div>Account Component</div>);
jest.mock("../../pages/country", () => () => <div>Country Component</div>);
jest.mock("../../pages/user", () => () => <div>User Component</div>);

describe("AppRoutes Component", () => {
  test("renders App component", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("App Component")).toBeInTheDocument();
  });

  test("renders Error404 component", () => {
    render(
      <MemoryRouter initialEntries={["/random"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Error 404 Component")).toBeInTheDocument();
  });

  test("renders LogIn component", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("LogIn Component")).toBeInTheDocument();
  });

  test("renders SignUp component", () => {
    render(
      <MemoryRouter initialEntries={["/signup"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("SignUp Component")).toBeInTheDocument();
  });

  test("renders ResetPassword component", () => {
    render(
      <MemoryRouter initialEntries={["/reset-password"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("ResetPassword Component")).toBeInTheDocument();
  });

  test("renders Account component", () => {
    render(
      <MemoryRouter initialEntries={["/me/settings"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Account Component")).toBeInTheDocument();
  });

  test("renders Country component", () => {
    render(
      <MemoryRouter initialEntries={["/country/1"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("Country Component")).toBeInTheDocument();
  });

  test("renders User component", () => {
    render(
      <MemoryRouter initialEntries={["/user/1"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("User Component")).toBeInTheDocument();
  });
});
