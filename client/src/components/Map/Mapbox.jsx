import React, { useState, useRef, useCallback } from "react";
import InteractiveMap, {
  Source,
  Layer,
  Marker,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
} from "react-map-gl";
import { dataLayer } from "../../utils/map-style.ts";
import data from "../../assets/metadata/kfz250.geojson";
import "mapbox-gl/dist/mapbox-gl.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const Mapbox = () => {
  const [marker, setMarker] = useState([]);
  const [ok, setOk] = useState(false);
  const mapRef = useRef(null);
  const handleClick = useCallback(async (event) => {
    const longitude = event.lngLat.lng;
    const latitude = event.lngLat.lat;
    setMarker([{ longitude, latitude }]);
    const map = mapRef.current.getMap();
    const features = await map.queryRenderedFeatures(event.point, {
      layers: ["name"],
    });

    if (features.length > 0) {
      const clickedName = features[0].properties.name;
      if (clickedName === "DD") {
        setOk(true);
        console.log(true);
      } else {
        setOk(false);
      }
      console.log(`clicked: ${clickedName}`);
    }
  }, []);

  return (
    <InteractiveMap
      mapboxAccessToken="pk.eyJ1IjoibWFydGluZnp6IiwiYSI6ImNtMnl0eWltdDA0NnUyd3FzNWN5aDQ5OTkifQ.ZtRxBpmpMa9pxB02NZeFgQ"
      initialViewState={{
        longitude: 2,
        latitude: 46,
        zoom: 5,
      }}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      onClick={handleClick}
      ref={mapRef}
    >
      <FullscreenControl position="bottom-right" />
      <NavigationControl position="bottom-right" />
      <ScaleControl />

      <Source type="geojson" data={data}>
        <Layer {...dataLayer} />
      </Source>

      {marker.length
        ? marker.map((m, i) => (
            <Marker {...m} key={i}>
              <FontAwesomeIcon
                icon={faLocationDot}
                size="3x"
                style={{ color: ok ? "green" : "#d00" }}
              />
            </Marker>
          ))
        : null}
    </InteractiveMap>
  );
};

export default Mapbox;
