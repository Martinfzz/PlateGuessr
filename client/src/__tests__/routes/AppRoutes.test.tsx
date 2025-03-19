import React from "react";
import { render, screen } from "@testing-library/react";
import AppRoutes from "../../routes/AppRoutes";
import { MemoryRouter } from "react-router-dom";
import { AuthContextProvider, AuthContext } from "../../context/AuthContext";

jest.mock("../../App", () => {
  return () => <div>App Component</div>;
});
jest.mock("../../pages/error404", () => {
  return () => <div>Error 404 Component</div>;
});
jest.mock("../../pages/login", () => {
  return () => <div>LogIn Component</div>;
});
jest.mock("../../pages/signup", () => {
  return () => <div>SignUp Component</div>;
});
jest.mock("../../pages/resetPassword", () => () => (
  <div>ResetPassword Component</div>
));
jest.mock("../../pages/account", () => {
  return () => <div>Account Component</div>;
});
jest.mock("../../pages/country", () => {
  return () => <div>Country Component</div>;
});
jest.mock("../../pages/user", () => {
  return () => <div>User Component</div>;
});
jest.mock("../../pages/setPassword", () => {
  return () => <div>SetPassword Component</div>;
});

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

  test("renders Account component if user is logged in", () => {
    render(
      <AuthContext.Provider
        value={{
          user: {
            id: "1",
            username: "test",
            email: "test@test.com",
            token: "123Token",
            isVerified: true,
            authSource: "self",
          },
          dispatch: jest.fn(),
        }}
      >
        <MemoryRouter initialEntries={["/me/settings"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText("Account Component")).toBeInTheDocument();
  });

  test("renders App component if user is not logged in", () => {
    render(
      <AuthContextProvider>
        <MemoryRouter initialEntries={["/me/settings"]}>
          <AppRoutes />
        </MemoryRouter>
      </AuthContextProvider>
    );

    expect(screen.getByText("App Component")).toBeInTheDocument();
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

  test("renders SetPassword component", () => {
    render(
      <MemoryRouter initialEntries={["/set-password/123Token"]}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText("SetPassword Component")).toBeInTheDocument();
  });
});
