import { countriesLayer, highlightLayer } from "../../utils/countries-layer";

describe("countries-layer", () => {
  test("should have correct properties and values for countriesLayer", () => {
    expect(countriesLayer).toEqual({
      id: "countries",
      type: "fill",
      source: "countries",
      paint: {
        "fill-color": {
          property: "ID",
          stops: [[276, "#ffcc00"]],
        },
        "fill-opacity": 0.5,
      },
    });
  });

  test("should have correct properties and values for highlightLayer", () => {
    expect(highlightLayer).toEqual({
      id: "counties-highlighted",
      type: "fill",
      source: "counties",
      paint: {
        "fill-color": {
          property: "ID",
          stops: [[276, "#ffcc00"]],
        },
        "fill-opacity": 0.2,
      },
    });
  });
});
