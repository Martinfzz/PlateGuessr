describe("Login", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("contains correct button texts", () => {
    cy.getByData("google-button").contains("Continue with Google");
    cy.getByData("apple-button").contains("Continue with Apple");
    cy.getByData("facebook-button").contains("Continue with Facebook");
  });

  it("contains correct link text", () => {
    cy.getByData("signup-link").contains("Create an account");
  });

  it("should not be able to click on some buttons", () => {
    cy.getByData("apple-button").should("be.disabled");
    cy.getByData("facebook-button").should("be.disabled");
  });

  it("should go to the login page", () => {
    cy.getByData("signup-link").click();
    cy.location("pathname").should("equal", "/signup");
  });

  it("should go to the main page when clicking the logo", () => {
    cy.getByData("logo-full").click();
    cy.location("pathname").should("equal", "/");
  });

  it("should go to the reset password page", () => {
    cy.getByData("forgot-password-link").click();
    cy.location("pathname").should("equal", "/reset-password");
  });

  describe("Google login", () => {
    it("logs in with Google", () => {
      cy.getByData("google-button").click();
    });
  });

  describe("Email login", () => {
    it("should display required error message if inputs are empty", () => {
      cy.getByData("login-button").click();

      const inputs = ["email-input", "password-input"];

      inputs.forEach((testId) => {
        cy.get(`[data-testid="${testId}"]`)
          .parent()
          .siblings()
          .contains("Required");
      });
    });

    it("should display email error message if email is invalid", () => {
      cy.getByData("email-input").type("test");
      cy.getByData("login-button").click();
      cy.get('[data-testid="email-input"]').then(($input) => {
        expect(($input[0] as HTMLInputElement).validationMessage).to.eq(
          "Please include an '@' in the email address. 'test' is missing an '@'."
        );
      });
      cy.getByData("email-input").type("@example");
      cy.getByData("login-button").click();
      cy.getByData("email-input").type(".");
      cy.getByData("login-button").click();
      cy.get(`[data-testid="email-input"]`)
        .parent()
        .siblings()
        .contains("Invalid email");
    });

    it("should display an error if the email is not in the database", () => {
      cy.getByData("email-input").type("test@example.com");
      cy.getByData("password-input").type("password");
      cy.getByData("login-button").click();
      cy.getByData("alert-message").contains("Incorrect email");
    });

    it("should display an error if the password is incorrect", () => {
      cy.intercept("POST", "/api/user/login", {
        statusCode: 400,
        body: { error: "Incorrect password" },
      });

      cy.getByData("email-input").type("test@example.com");
      cy.getByData("password-input").type("password");
      cy.getByData("login-button").click();
      cy.getByData("alert-message").contains("Incorrect password");
    });

    it("should display errors when the email is not verified", () => {
      cy.intercept("POST", "/api/user/login", {
        statusCode: 400,
        body: {
          error: "validations.email_not_verified",
          email: "test@example.com",
        },
      });

      cy.intercept("POST", "/api/user/resend-verification-email", {
        statusCode: 200,
        body: {},
      });

      cy.getByData("email-input").type("test@example.com");
      cy.getByData("password-input").type("password");
      cy.getByData("login-button").click();
      cy.getByData("alert-message")
        .first()
        .contains("Please verify your email before logging in.");
      const resendEmail = cy
        .getByData("alert-message")
        .contains("Resend verification email");
      resendEmail.click();
      cy.get(".Toastify__toast-body").contains(
        "A verification email has been sent to your inbox. Please check your email to verify your account."
      );
      cy.wait(4000);
      cy.get(".Toastify__toast-body").should("not.exist");
    });

    it("should login successfully", () => {
      cy.intercept("POST", "/api/user/login", {
        statusCode: 200,
        body: {
          id: "1",
          username: "testuser",
          email: "test@example.com",
          token: "testtoken",
        },
      });

      cy.getByData("email-input").type("test@example.com");
      cy.getByData("password-input").type("password");
      cy.getByData("login-button").click();
      cy.location("pathname").should("equal", "/");
    });
  });
});
