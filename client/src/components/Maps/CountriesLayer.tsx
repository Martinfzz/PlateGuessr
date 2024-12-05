import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import { countriesLayer, highlightLayer } from "../../utils/countries-layer";
import { useSelector } from "react-redux";
import { HoverInfo } from "shared.types";
import { FilterSpecification } from "mapbox-gl";
const countries = require("../../assets/metadata/geojson/countries.geojson");

interface GameState {
  game: {
    hoverInfo: HoverInfo;
  };
}

const CountriesLayer = () => {
  const { hoverInfo } = useSelector((state: GameState) => state.game);
  const selectedCountry = (hoverInfo && hoverInfo.countryId) || "";
  const filter = useMemo<FilterSpecification>(
    () => ["in", "ID", selectedCountry],
    [selectedCountry]
  );

  return (
    <Source type="geojson" data={countries}>
      <Layer {...countriesLayer} />
      <Layer {...highlightLayer} filter={filter} />
    </Source>
  );
};

export default CountriesLayer;
