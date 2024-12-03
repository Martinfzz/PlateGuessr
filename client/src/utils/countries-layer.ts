import type { FillLayer } from "react-map-gl";

export const countriesLayer: FillLayer = {
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
};

// Highlighted county polygons
export const highlightLayer: FillLayer = {
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
};
