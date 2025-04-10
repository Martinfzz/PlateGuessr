describe("setGame", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the country popup", () => {
    cy.getByData("country-play-btn").should("not.exist");
    cy.wait(5000);

    cy.get(".mapboxgl-canvas").trigger("click", { clientX: 850, clientY: 100 });

    cy.getByData("country-play-btn").should("exist");
  });

  it.only("should display the game modal", () => {
    cy.getByData("game-modal").should("not.exist");

    cy.wait(5000);
    cy.get(".mapboxgl-canvas")
      .trigger("click", { clientX: 850, clientY: 100 })
      .wait(200);

    cy.getByData("country-play-btn").click();
    cy.getByData("game-modal").should("exist");
  });

  it("should select the different options", () => {});
});
