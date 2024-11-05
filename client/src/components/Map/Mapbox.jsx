import React from 'react';
import Map, {Source, Layer} from 'react-map-gl';
import {dataLayer} from '../../utils/map-style.ts';
import data from '../../assets/metadata/kfz250.geojson'

import 'mapbox-gl/dist/mapbox-gl.css';

const Mapbox = () => {
  
  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoibWFydGluZnp6IiwiYSI6ImNtMnl0eWltdDA0NnUyd3FzNWN5aDQ5OTkifQ.ZtRxBpmpMa9pxB02NZeFgQ"
      initialViewState={{
        longitude: 2,
        latitude: 46,
        zoom: 5
      }}
      style={{width: '100vw', height: '100vh'}}
      mapStyle="mapbox://styles/mapbox/light-v11"
    >
      <Source type="geojson" data={data}>
          <Layer {...dataLayer} />
        </Source>
      </Map>
  );
};

export default Mapbox;