describe("Signup", () => {
  beforeEach(() => {
    cy.visit("/signup");
  });

  it("contains correct headers texts", () => {
    cy.getByData("signup-title-1").contains("Get started");
    cy.getByData("signup-title-2").contains("Choose sign-up method");
  });

  it("contains correct button texts", () => {
    cy.getByData("google-button").contains("Continue with Google");
    cy.getByData("apple-button").contains("Continue with Apple");
    cy.getByData("facebook-button").contains("Continue with Facebook");
    cy.getByData("email-button").contains("Continue with Email");
  });

  it("contains correct link text", () => {
    cy.getByData("login-link").contains("Already have an account?");
  });

  it("should not be able to click on some buttons", () => {
    cy.getByData("apple-button").should("be.disabled");
    cy.getByData("facebook-button").should("be.disabled");
  });

  it("should go to the login page", () => {
    cy.getByData("login-link").click();
    cy.location("pathname").should("equal", "/login");
  });

  it("should go to the main page when clicking the logo", () => {
    cy.getByData("logo-full").click();
    cy.location("pathname").should("equal", "/");
  });

  describe("Google login", () => {
    it("logs in with Google", () => {
      cy.getByData("google-button").click();
    });
  });

  describe("Email signup", () => {
    it("opens email modal", () => {
      cy.getByData("email-modal").should("not.exist");

      cy.getByData("email-button").click();
      cy.getByData("email-modal").should("be.visible");
      cy.getByData("signup-email-modal-title-1").contains("Almost there!");
      cy.getByData("signup-email-modal-title-2").contains(
        "Just a few more steps and you're ready to go!"
      );
    });

    it("closes email modal", () => {
      cy.getByData("email-button").click();
      cy.getByData("email-modal").should("be.visible");

      cy.getByData("close-button").click();
      cy.getByData("email-modal").should("not.exist");
    });

    it("should display required error message if inputs are empty", () => {
      cy.getByData("email-button").click();
      cy.getByData("signup-button").click();

      const inputs = [
        "email-input",
        "password-input",
        "password-confirmation-input",
      ];

      inputs.forEach((testId) => {
        cy.get(`[data-testid="${testId}"]`)
          .parent()
          .siblings()
          .contains("Required");
      });
    });

    it("should display email error message if email is invalid", () => {
      cy.getByData("email-button").click();
      cy.getByData("email-input").type("test");
      cy.getByData("signup-button").click();
      cy.get('[data-testid="email-input"]').then(($input) => {
        expect(($input[0] as HTMLInputElement).validationMessage).to.eq(
          "Please include an '@' in the email address. 'test' is missing an '@'."
        );
      });
      cy.getByData("email-input").type("@example");
      cy.getByData("signup-button").click();
      cy.getByData("email-input").type(".");
      cy.getByData("signup-button").click();
      cy.get(`[data-testid="email-input"]`)
        .parent()
        .siblings()
        .contains("Invalid email");
    });

    it("should display password error message if password is invalid", () => {
      cy.getByData("email-button").click();
      cy.getByData("password-input").type("test");
      cy.getByData("signup-button").click();
      cy.get(`[data-testid="password-input"]`)
        .parent()
        .siblings()
        .contains(
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
        );
    });

    it("should display password confirmation error message if passwords do not match", () => {
      cy.getByData("email-button").click();
      cy.getByData("password-input").type("Password123!");
      cy.getByData("password-confirmation-input").type("Password123");
      cy.getByData("signup-button").click();
      cy.get(`[data-testid="password-confirmation-input"]`)
        .parent()
        .siblings()
        .contains("Your passwords do not match");
    });

    it("submits email form", () => {
      cy.intercept("POST", "/api/user/signup", {
        statusCode: 200,
        body: {},
      });

      cy.getByData("email-button").click();

      cy.getByData("email-input").type("test@example.com");
      cy.getByData("password-input").type("Password123!");
      cy.getByData("password-confirmation-input").type("Password123!");
      cy.getByData("signup-button").click();

      cy.location("pathname").should("equal", "/login");
      cy.get(".Toastify__toast-body").contains(
        "A verification email has been sent to your inbox. Please check your email to verify your account."
      );
      cy.wait(4000);
      cy.get(".Toastify__toast-body").should("not.exist");
    });

    it("handles signup error", () => {
      cy.intercept("POST", "/api/user/signup", {
        statusCode: 400,
        body: { error: "Passwords do not match" },
      });

      cy.getByData("email-button").click();

      cy.getByData("email-input").type("test@example.com");
      cy.getByData("password-input").type("Password123!");
      cy.getByData("password-confirmation-input").type("Password123!");
      cy.getByData("signup-button").click();
      cy.getByData("alert-message").contains("Passwords do not match");
    });
  });
});
