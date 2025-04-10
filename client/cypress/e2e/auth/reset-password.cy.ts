describe("Reset password", () => {
  beforeEach(() => {
    cy.visit("/reset-password");
  });

  it("contains correct headers texts", () => {
    cy.getByData("reset-password-heading").contains("Reset password");
  });

  it("contains navbar", () => {
    cy.getByData("navbar").should("exist");
  });

  it("should display required error message if input is empty", () => {
    cy.getByData("reset-password-button").click();
    cy.getByData("email-input").parent().siblings().contains("Required");
  });

  it("should display email error message if email is invalid", () => {
    cy.getByData("email-input").type("test");
    cy.getByData("reset-password-button").click();
    cy.get('[data-testid="email-input"]').then(($input) => {
      expect(($input[0] as HTMLInputElement).validationMessage).to.eq(
        "Please include an '@' in the email address. 'test' is missing an '@'."
      );
    });

    cy.reload();
    cy.getByData("reset-password-button").click();
    cy.get(`[data-testid="email-input"]`)
      .parent()
      .siblings()
      .contains("Required");
    cy.getByData("email-input").type("tes");
    cy.get(`[data-testid="email-input"]`)
      .parent()
      .siblings()
      .contains("Invalid email");
  });

  it("should display an error if an error occurs", () => {
    cy.intercept("POST", "/api/user/reset-password", {
      statusCode: 400,
      body: { error: "An error occurred" },
    });

    cy.getByData("email-input").type("test@example.com");
    cy.getByData("reset-password-button").click();
    cy.getByData("alert-message").contains("An error occurred");
  });

  it("should display success messages if request is successful", () => {
    cy.intercept("POST", "/api/user/reset-password", {
      statusCode: 200,
      body: {},
    });

    cy.getByData("email-input").type("test@example.com");
    cy.getByData("reset-password-button").click();
    cy.getByData("reset-password-success-title").contains(
      "You have a message!"
    );
    cy.getByData("reset-password-success-message").contains(
      "We've sent you an email with a link to reset your password. Please check your inbox."
    );
  });
});
