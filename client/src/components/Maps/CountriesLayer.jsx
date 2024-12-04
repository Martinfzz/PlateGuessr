import React, { useMemo } from "react";
import { Source, Layer } from "react-map-gl";
import countries from "../../assets/metadata/geojson/countries.geojson";
import { countriesLayer, highlightLayer } from "../../utils/countries-layer";
import { useSelector } from "react-redux";

const CountriesLayer = () => {
  const { hoverInfo } = useSelector((state) => state.game);
  const selectedCountry = (hoverInfo && hoverInfo.countryId) || "";
  const filter = useMemo(
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
