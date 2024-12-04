import React from "react";
import { Source, Layer, Marker } from "react-map-gl";
import data from "../../assets/metadata/geojson/germany.geojson";
import { dataLayer } from "../../utils/data-layer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const CountryLayer = () => {
  const { gameOptions, markers } = useSelector((state) => state.game);

  return (
    <>
      <Source type="geojson" data={data}>
        <Layer {...dataLayer(gameOptions)} />
      </Source>

      {markers.user.length
        ? markers.user.map((m, i) => (
            <Marker {...m} key={i} anchor="bottom">
              <FontAwesomeIcon
                icon={faLocationDot}
                size="3x"
                style={{
                  color: markers.color,
                  marginBottom: "2px",
                }}
              />
            </Marker>
          ))
        : null}

      {markers.answer.length
        ? markers.answer.map((m, i) => (
            <Marker {...m} key={i} anchor="bottom">
              <FontAwesomeIcon
                icon={faLocationDot}
                size="3x"
                style={{
                  color: "#47A025",
                  marginBottom: "2px",
                }}
              />
            </Marker>
          ))
        : null}
    </>
  );
};

export default CountryLayer;
