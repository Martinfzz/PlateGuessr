import { dataLayer } from "../../utils/data-layer";

describe("dataLayer", () => {
  test("should return correct layer properties when toggleColors is true", () => {
    const gameOptions = {
      toggleColors: true,
      toggleBorders: true,
      color: "#ff0000",
    };

    const expectedLayer = {
      id: "country",
      type: "fill",
      source: "country",
      paint: {
        "fill-color": {
          property: "percentile",
          stops: [
            [0, "#3288bd"],
            [1, "#66c2a5"],
            [2, "#abdda4"],
            [3, "#e6f598"],
            [4, "#ffffbf"],
            [5, "#fee08b"],
            [6, "#fdae61"],
            [7, "#f46d43"],
            [8, "#d53e4f"],
          ],
        },
        "fill-opacity": 0.5,
        "fill-outline-color": "#000",
      },
    };

    expect(dataLayer(gameOptions)).toEqual(expectedLayer);
  });

  test("should return correct layer properties when toggleColors is false", () => {
    const gameOptions = {
      toggleColors: false,
      toggleBorders: false,
      color: "#ff0000",
    };

    const expectedLayer = {
      id: "country",
      type: "fill",
      source: "country",
      paint: {
        "fill-color": {
          property: "percentile",
          stops: Array(9)
            .fill([0, gameOptions.color])
            .map((_, i) => [i, gameOptions.color]),
        },
        "fill-opacity": 0.5,
        "fill-outline-color": "#fde47e",
      },
    };

    expect(dataLayer(gameOptions)).toEqual(expectedLayer);
  });
});
