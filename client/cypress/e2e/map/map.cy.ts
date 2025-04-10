describe("Map", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the map", () => {
    // cy.wait(5000);
    cy.get(".mapboxgl-map").should("exist");
  });

  it.only("drags ", () => {
    // const map = cy.get(".mapboxgl-map");
    // map.should("exist");

    const canvas = cy.get(".mapboxgl-canvas");
    canvas.should("exist");

    cy.get(".mapboxgl-canvas").should("be.visible");
    cy.get(".mapboxgl-canvas").should("have.css", "cursor", "grab");

    cy.wait(10000);

    // canvas.trigger("mousedown", { which: 1, pageX: 850, pageY: 111 });
    canvas.trigger("click", { clientX: 850, clientY: 100 }).wait(200);
    // canvas.trigger("mouseenter", { clientX: 500, clientY: 100 }).wait(200);
    // canvas.trigger("click").wait(200);
    // canvas.trigger("mousedown", "topRight").wait(200);
    // canvas.trigger("mousemove", "bottomLeft").wait(200);
    // canvas.trigger("mouseup").wait(200);
    // canvas
    //   .trigger("mousedown", {
    //     clientX: 200,
    //     clientY: 200,
    //     button: 0,
    //     force: true,
    //   })
    //   .wait(100)
    //   .trigger("mousemove", { clientX: 220, clientY: 200, force: true })
    //   .trigger("mousemove", { clientX: 250, clientY: 200, force: true })
    //   .trigger("mousemove", { clientX: 280, clientY: 200, force: true })
    //   .trigger("mousemove", { clientX: 300, clientY: 200, force: true })
    //   .wait(100)
    //   .trigger("mouseup", { force: true });
    cy.window().then((win) => {
      const canvas = win.document.querySelector(".mapboxgl-canvas");

      ["mousedown", "mousemove", "mouseup", "pointermove", "click"].forEach(
        (eventType) => {
          canvas?.addEventListener(eventType, () =>
            console.log(`Event ${eventType} triggered`)
          );
        }
      );

      const fireEvent = (type: any, x: any, y: any) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
        });
        canvas?.dispatchEvent(event);
      };

      // Simulate click
      fireEvent("click", 200, 200);
      // Start dragging
      fireEvent("mousedown", 200, 200);

      // cy.wait(1000).then(() => fireEvent("mousemove", 220, 200));
      // cy.wait(1000).then(() => fireEvent("mousemove", 250, 200));
      // cy.wait(1000).then(() => fireEvent("mousemove", 280, 200));
      cy.wait(1000).then(() => fireEvent("mousemove", 500, 200));

      // Release mouse
      cy.wait(1000).then(() => fireEvent("mouseup", 300, 200));
    });
  });
});
