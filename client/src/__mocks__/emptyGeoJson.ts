const emptyGeoJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Empty",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [0, 0],
            [0, 0],
          ],
        ],
      },
    },
  ],
};
export default emptyGeoJson;

export {};
