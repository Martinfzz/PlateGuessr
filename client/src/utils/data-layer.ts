import type { FillLayer } from "react-map-gl";

export const dataLayer = (gameOptions: any) => {
  const layer: FillLayer = {
    id: "country",
    type: "fill",
    source: "country",
    paint: {
      "fill-color": {
        property: "percentile",
        stops: gameOptions.toggleColors
          ? [
              [0, "#3288bd"],
              [1, "#66c2a5"],
              [2, "#abdda4"],
              [3, "#e6f598"],
              [4, "#ffffbf"],
              [5, "#fee08b"],
              [6, "#fdae61"],
              [7, "#f46d43"],
              [8, "#d53e4f"],
            ]
          : Array(9)
              .fill([0, gameOptions.color])
              .map((_, i) => [i, gameOptions.color]),
      },
      "fill-opacity": 0.5,
      "fill-outline-color": gameOptions.toggleBorders ? "#000" : "#cacaca",
    },
  };
  return layer;
};
